import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";

export const runtime = "nodejs";

function runLibreOfficeConvert(inputPath, outDir) {
	return new Promise((resolve, reject) => {
		// Try common binary names for LibreOffice
		const bins = [
			"C:\\Program Files\\LibreOffice\\program\\soffice.exe", // try this first
			"soffice",
			"libreoffice",
		];
		let tried = 0;

		function tryBin() {
			if (tried >= bins.length) {
				return reject(new Error("LibreOffice (soffice) not found on PATH"));
			}
			const bin = bins[tried++];
            const args = ["--headless", "--convert-to", "pdf", "--outdir", outDir, inputPath];
			console.log(`[LibreOffice] Trying: ${bin}`);
			console.log(`[LibreOffice] Args: ${args.join(' ')}`);
			execFile(bin, args, { timeout: 60_000 }, (err, stdout, stderr) => {
				console.log(`[LibreOffice] stdout:`, stdout);
				console.log(`[LibreOffice] stderr:`, stderr);
				if (err) {
					console.log(`[LibreOffice] Error (code=${err.code}):`, err.message);
					// If command not found, try next binary
					if (err.code === 'ENOENT') return tryBin();
					// Otherwise treat as failure
					return reject(err);
				}
				resolve({ stdout, stderr });
			});
		}
		tryBin();
	});
}

function naturalSort(a, b) {
	return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function convertPdfToImages(pdfPath, outDir) {
  return new Promise((resolve, reject) => {
    const bins = [
      "C:\\Users\\caspe\\Downloads\\poppler-25.11.0\\Library\\bin\\pdftoppm.exe",
      "pdftoppm",
    ];
		let tried = 0;

		function tryBin() {
			if (tried >= bins.length) {
				return reject(new Error("pdftoppm not found on PATH"));
			}
			const bin = bins[tried++];
			// pdftoppm -png <input.pdf> <output_prefix>
			// This outputs output_prefix-1.png, output_prefix-2.png, etc.
			const outputPrefix = path.join(outDir, 'slide');
			const args = ["-png", pdfPath, outputPrefix];
			console.log(`[PDF→Image] Trying: ${bin}`);
			console.log(`[PDF→Image] Args: ${args.join(' ')}`);
			execFile(bin, args, { timeout: 60_000 }, (err, stdout, stderr) => {
				console.log(`[PDF→Image] stdout:`, stdout);
				console.log(`[PDF→Image] stderr:`, stderr);
				if (err) {
					console.log(`[PDF→Image] Error (code=${err.code}):`, err.message);
					if (err.code === 'ENOENT') return tryBin();
					return reject(err);
				}
				resolve({ stdout, stderr });
			});
		}
		tryBin();
	});
}

export async function POST(req) {
	try {
		const form = await req.formData();
		const file = form.get('ppt') || form.get('file') || form.get('pptx');
		if (!file) return new Response('No file uploaded', { status: 400 });

		const arr = await file.arrayBuffer();
		const buffer = Buffer.from(arr);

		const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ppt-'));
		const inputPath = path.join(tmpRoot, 'upload.pptx');
		fs.writeFileSync(inputPath, buffer);

		// Convert PPTX to PDF
		await runLibreOfficeConvert(inputPath, tmpRoot);

		// Convert PDF to images (one image per slide)
		const pdfPath = path.join(tmpRoot, 'upload.pdf');
		if (!fs.existsSync(pdfPath)) {
			try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (e) {}
			return new Response('PDF conversion failed: no upload.pdf found', { status: 500 });
		}

		await convertPdfToImages(pdfPath, tmpRoot);

		// Read all files from tmpRoot for debugging
		const allFiles = fs.readdirSync(tmpRoot);
		console.log(`[POST] All files in tmpRoot:`, allFiles);

		// Filter for image files (png, jpg, jpeg, gif)
		const files = allFiles
			.filter((f) => /\.(png|jpe?g|gif)$/i.test(f))
			.sort(naturalSort);
		
		console.log(`[POST] Filtered image files:`, files);
		
		if (!files || files.length === 0) {
			// Cleanup
			try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (e) {}
			return new Response(
				`Conversion failed or produced no slides. Files found: ${allFiles.join(', ')}`,
				{ status: 500 }
			);
		}

		// Convert to data URLs, detecting MIME type by extension
		const slides = files.map((fname) => {
			const p = path.join(tmpRoot, fname);
			const data = fs.readFileSync(p);
			const ext = path.extname(fname).toLowerCase();
			let mimeType = 'image/png';
			if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
			else if (ext === '.gif') mimeType = 'image/gif';
			return `data:${mimeType};base64,${data.toString('base64')}`;
		});

		// Build a minimal full-screen HTML presentation that handles left/right/escape
		const html = `<!doctype html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1" />
	<title>Presentation</title>
	<style>
		html,body{height:100%;margin:0;background:#000}
		.slide{display:flex;align-items:center;justify-content:center;height:100%;width:100%}
		img{max-width:100%;max-height:100%;object-fit:contain}
		.counter{position:fixed;left:12px;top:12px;color:#fff;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
	</style>
 </head>
<body>
	<div id="app">
		<div class="counter" id="counter">1 / ${slides.length}</div>
		<div class="slide" id="slideContainer">
			<img id="slideImg" src="${slides[0]}" alt="slide" />
		</div>
	</div>
	<script>
		(function(){
			const slides = ${JSON.stringify(slides)};
			let idx = 0;
			const img = document.getElementById('slideImg');
			const counter = document.getElementById('counter');
			function show(i){
				idx = (i + slides.length) % slides.length;
				img.src = slides[idx];
				counter.textContent = (idx+1) + ' / ' + slides.length;
			}
			window.addEventListener('keydown', (e) => {
				if (e.key === 'ArrowRight') { show(idx+1); }
				else if (e.key === 'ArrowLeft') { show(idx-1); }
				else if (e.key === 'Escape') { window.parent.postMessage({ type: 'close' }, '*'); }
			});

			// Listen for messages from parent (forwarded key events)
			window.addEventListener('message', (ev) => {
				try {
					const d = ev.data;
					if (!d || !d.type) return;
					if (d.type === 'next') show(idx+1);
					else if (d.type === 'prev') show(idx-1);
					else if (d.type === 'close') {
						if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
						// notify parent that child closed
						window.parent.postMessage({ type: 'closed' }, '*');
					}
				} catch (e) {}
			});
			// Try to request fullscreen on load
			function tryFullscreen(){
				const el = document.documentElement;
				if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
			}
			tryFullscreen();
		})();
	</script>
</body>
</html>`;

		// Cleanup temp files asynchronously (keep slides available while response downloads)
		setTimeout(() => {
			try { fs.rmSync(tmpRoot, { recursive: true, force: true }); } catch (e) {}
		}, 30_000);

		return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
	} catch (err) {
		console.error(err);
		return new Response('Server error: ' + String(err.message || err), { status: 500 });
	}
}
