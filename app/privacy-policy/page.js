// app/privacy-policy/page.js
"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/page/Header";
import Footer from "@/components/Footer";

export default function Page() {

  return (
    <div className="min-h-screen flex flex-col bg-[#fff] font-sans">
      <Header />
      
    
  <main className="px-6 pt-20 pb-12 md:pt-12 max-w-5xl mx-auto text-[#555]">
      <div className="w-layout-blockcontainer w-container">
        <div
          id="w-node-_3d2602c3-a612-3fff-3c9d-6e9073848d7e-b40e971f"
          className="w-layout-layout wf-layout-layout"
        >
          <div className="w-layout-cell">
            <h1 className="heading-1 text-3xl text-black mb-6">Privacy Policy</h1>
            <p className="privacy-paragraph">Effective Date: March 24, 2025</p>
            <p className="privacy-paragraph">
              At FRESHR, protecting your personal data is our priority.
              <br />
              <br />
              Whether you use the platform VoiceFlow (the "<strong>Platform</strong>")
              as our client (the “<strong>Client</strong>”) and as part of the
              management of our contractual relations with our Client, we may collect
              personal data about you.
              <br />
              The purpose of this policy is to inform you about how we process your
              personal data in compliance with Regulation (EU) 2016/679 of 27 April 2016
              on the protection of natural persons with regard to the processing of
              personal data and on the free movement of such data (hereinafter the
              "<strong>GDPR</strong>") and French Data Protection Law n° 78-17 of 6 January 1978
              (together the "<strong>Applicable Regulations</strong>").
              <br />
              <br />
              <strong>1. Who is the data controller</strong>?
              <br /><br />
              The data controller is FRESHR, joint-stock company, registered with
              the Registry of Trade and Companies of Rouen under the number 832 905 327
              and whose head office is located at 27 Rue Alfred Kastler, Mont Saint Aignan,
              76130 France (“<strong>Us</strong>” or “<strong>We</strong>”) when browsing
              on our Platform or when using your account on our Platform as our Client.
              <br />
              <br />
              <strong>2. What personal data we collect?</strong>
              <br /><br />
              Personal data is a data that identifies an individual directly or
              indirectly, in particular by reference to an identifier such as a name.
              <br />
              <br />
              We may collect the following personal data:
            </p>
            <br />
            <ul role="list" className="list">
              <li>
                <strong>Identification data</strong> (e.g. full name, email addresses);
              </li>
              <li>
                <strong>Data relating to your orders</strong>;
              </li>
              <li>
                <strong>Login data</strong> (e.g. logs, IP address);
              </li>
              <li>
                <strong>If you choose to sign in using a third-party authentication service</strong>{" "}
                (e.g., Google or Microsoft), certain data such as your name and email
                may be collected from that service. By choosing this method, you agree
                that the service may share this information with us. We do not collect
                your third-party account password;
              </li>
              <li>Browsing data (IP address, pages viewed, date and time of connection, browser used, operating system, user ID);</li>
              <li>
                <strong>Location data</strong>;
              </li>
              <li>
                <strong>Data related to recordings from telephone calls with our customer care service</strong>{" "}
                (e.g. content of the calls, dates of the calls);
              </li>
              <li>
                <strong>Economic and financial data</strong> (e.g. bank details);
              </li>
              <li>
                <strong>Data related to your credit cards</strong>.
              </li>
              <li>
                <strong>Any information you wish to send us as part of your contact request.</strong>
              </li>
            </ul>
            <br />
            <p className="privacy-paragraph">
              We inform you, when collecting your personal data, whether some of these
              data are mandatory or optional.
              <br /><br />
              <strong>
                3. On what legal basis, for what purposes and for how long do we keep
                your personal data?
              </strong>
            </p>
            <br />
            <table className="table_component">
              <thead className="table_head">
                <tr className="table_row">
                  <th className="table_header">Objectives</th>
                  <th className="table_header">Legal basis</th>
                  <th className="table_header">Data retention period</th>
                </tr>
              </thead>
              <tbody className="table_body">
                <tr className="table_row">
                  <td className="table_cell">
                    To provide you with our services available on our Platform through
                    your account
                  </td>
                  <td className="table_cell">
                    Performance of a contract to which you are party and/or taking steps
                    at your request prior to entering into a contract
                  </td>
                  <td className="table_cell py-8">
                    When you have created your account: personal data are retained for
                    the duration of your account. Your connection logs are kept for 10
                    weeks. If your account is inactive for a period of 2 years, it will
                    be deleted if you do not respond to our reactivation email. In
                    addition, personal data may be archived for probationary purposes for
                    a period of 5 years.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">
                    To perform operations related to contracts, orders, invoices and
                    customer relationship management
                  </td>
                  <td className="table_cell">Performance of a contract to which you are party</td>
                  <td className="table_cell py-8">
                    Personal data are retained for the duration of our business
                    relationship. In addition, the data relating to your transactions
                    (with the exception of your banking data) are archived for probationary
                    purposes for a period of 5 years. The data relating to your contract
                    and the elements relating to the signature of the contract are stored
                    for 10 years from the conclusion of the contract / the date of
                    delivery of the goods / the performance of the service. The data
                    related to your credit card are retained by our payment service
                    provider. The CVV2 (Card Verification Value), listed on your credit
                    card details, will not be stored.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To improve our services</td>
                  <td className="table_cell">Our legitimate interest in improving our services</td>
                  <td className="table_cell py-8">
                    Recording of telephone calls: 6 months from the date of collection Telephone
                    call content analysis documents: 1 year from the date of collection. The
                    personal data are retained for 6 months.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To manage your opinions on our products, services or content</td>
                  <td className="table_cell">
                    Our legitimate interest in collecting your opinions on our products, services
                  </td>
                  <td className="table_cell">2 years from the publication of the opinion</td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To create a database of customers and prospects</td>
                  <td className="table_cell">
                    Our legitimate interest in developing and promoting our business
                  </td>
                  <td className="table_cell py-8">
                    For our customers: their personal data are retained for the duration of
                    our business relationship. For our prospects: their personal data are
                    retained for a period of 3 years starting from the last contact with us
                    (e.g. communication, action).
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To send newsletters, requests and direct marketing mailings</td>
                  <td className="table_cell py-8">
                    For our customers: our legitimate interest in winning customer loyalty and
                    informing our customers of our latest news For our prospects: our legitimate
                    interest in winning customer loyalty and informing our customers of our latest
                    news
                  </td>
                  <td className="table_cell">
                    Personal data are retained for a period of 3 years starting from the last
                    contact with us (e.g. communication, action).
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">Making cold calls</td>
                  <td className="table_cell">
                    Our legitimate interest in developing and promoting our business
                  </td>
                  <td className="table_cell">
                    Data is kept for 3 years from the date of your last contact. We undertake
                    to check beforehand that your number is not on a BLOCTEL-type opposition list.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To answer to your information request and other inquiries</td>
                  <td className="table_cell">Our legitimate interest in responding to your inquiries</td>
                  <td className="table_cell py-8">
                    Personal data is kept for a period of 3 years from the date of your last contact.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To comply with our legal and regulatory obligations</td>
                  <td className="table_cell">Legal and regulatory obligations</td>
                  <td className="table_cell py-8">
                    Invoices are archived for a period of 10 years. In addition, the data relating
                    to your transactions (with the exception of your banking data) are archived for
                    probationary purposes for a period of 5 years. The data relating to your contract
                    and the elements relating to the signature of the contract are stored for 10 years
                    from the conclusion of the contract / the date of delivery of the goods / the
                    performance of the service.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">
                    To elaborate analytics (navigation, Platform audience, etc.) and improve the
                    functionality of the Platform by depositing audience measurement cookies
                  </td>
                  <td className="table_cell">Your consent</td>
                  <td className="table_cell">
                    The personal data are retained for 25 months.
                  </td>
                </tr>
                <tr className="table_row">
                  <td className="table_cell">To process data subjects’ requests to exercise their rights</td>
                  <td className="table_cell">
                    Our legitimate interest in responding to your requests and keeping records of them
                  </td>
                  <td className="table_cell py-8">
                    If we ask you a proof of identity: we only retain it for the necessary time to verify
                    your identity. Once the verification has been carried out, the proof is deleted.
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="privacy-paragraph">
              <strong>4. Who are the recipients of your personal data?</strong>
              <br /><br />
              (i) The following categories of recipients will have access to your personal data:
              <br />
              The staff of our company;
              <br />
              (ii) Our processors: artificial intelligence service provider, provider of
              lipsync, provider of generative voice AI, hosting service provider, newsletter
              sending service provider, audience measurement and analysis service provider,
              electronic messaging service provider, secure payment service provider,
              invoicing tool, cookie management tool, etc.;
              <br />
              (iii) If applicable: public and private organisations, exclusively to comply with our
              legal obligations.
            </p>
            <br />
            <p className="privacy-paragraph">
              <strong>5. Are your personal data likely to be transferred outside the European Union?</strong>
              <br /><br />
              Your personal data is hosted for the duration of the processing on the servers of the
              company AWS, located in the European Union.
              <br />
              As part of the tools, we use (see article on the recipients of your personal data,
              especially our processors), your personal data may be transferred outside the European
              Union. The transfer of your personal data in this context is secured with the use of
              following safeguards:
            </p>
            <br />
            <ul role="list" className="list-2">
              <li>
                Either personal data are transferred to a country that has been recognized as
                ensuring an adequate level of protection by a decision of the European Commission,
                in accordance with article 45 of the GDPR: in this case, this country ensures a
                level of protection deemed sufficient and adequate to the provisions of the GDPR; or
              </li>
              <br />
              <li>
                The personal data are transferred to a country whose level of data protection has not
                been recognized as adequate to the GDPR: in this case these transfers are based on
                appropriate safeguards indicated in article 46 of the GDPR, adapted to each provider,
                including but not limited the execution of Standard Contractual Clauses approved by
                the European Commission, the application of Binding Corporate Rules or an approved
                certification mechanism; or
              </li>
              <br />
              <li>
                The personal data are transferred under any appropriate safeguards described in
                Chapter V of the GDPR.
              </li>
            </ul>
            <br />
            <p className="privacy-paragraph">
              <strong>6. What rights can you exercise on your personal data?</strong>
              <br /><br />
              You have the following rights with regard to your personal data:
              <br /><br />
              <strong>- Right to be informed</strong>: this is precisely why we have drafted
              this privacy policy as defined by articles 13 and 14 of the GDPR.
              <br />
              <strong>- Right of access</strong>: you have the right to access all your personal
              data at any time as defined by article 15 of the GDPR.
              <br />
              <strong>- Right to rectification</strong>: you have the right to rectify your
              inaccurate, incomplete or obsolete personal data at any time as defined by article 16
              of the GDPR.
              <br />
              <strong>- Right to restriction of processing</strong>: you have the right to
              restrict the processing of your personal data in certain cases defined in article 18
              of the GDPR.
              <br />
              <strong>- Right to erasure</strong> (“right to be forgotten”): you have the right
              to request that your personal data be deleted and to prohibit any future collection as
              defined by article 17 of the GDPR.
              <br />
              <strong>- Right to file a complaint to a competent supervisory authority</strong> (in
              France, the CNIL), under article 77 of the GDPR, if you consider that the processing of
              your personal data constitutes a breach of applicable regulations.
              <br />
              <strong>- Right to define instructions related to the retention, deletion and communication
              of your personal data after your death</strong>.
              <br />
              <strong>- Right to withdraw your consent at any time</strong>: for purposes based on
              consent, Article 7 of the GDPR provides that you may withdraw your consent at any time.
              Such withdrawal will not affect the lawfulness of the processing carried out before the
              withdrawal.
              <br />
              <strong>- Right to data portability</strong>: under specific conditions defined in
              article 20 of the GDPR, you have the right to receive the personal data you have provided
              us in a standard machine-readable format and to require their transfer to the recipient
              of your choice.
              <br />
              <strong>- Right to object</strong>: You have the right to object to the processing of
              your personal data as defined by article 21 of the GDPR. Please note that we may continue
              to process your personal data despite this opposition for legitimate reasons or for the
              defense of legal claims.
              <br /><br />
              You can exercise these rights by writing us using the contact details below. For this
              matter we may ask you to provide us with additional information or documents to prove
              your identity.
            </p>
            <br />
            <p className="privacy-paragraph">
              <strong>7. What cookies do we use?</strong>
              <br /><br />
              For more information on cookies management, please consult our Cookies Policy.
              <br /><br />
              <strong>8. Contact information for data privacy matters</strong>
              <br /><br />
              Contact email:{" "}
              <a href="mailto:casper.apers@gmail.com" className="link-9">
                casper.apers@gmail.com
              </a>
              <br />
              Contact address: Belgium, Antwerp, 2050, Le Corbusierlaan 8
              <br /><br />
              <strong>9. Modifications</strong>
              <br /><br />
              We may modify this privacy policy at any time, in particular in order to comply with any
              regulatory, jurisprudential, editorial or technical change. These modifications will apply
              on the date of entry into force of the modified version. Please regularly consult the
              latest version of this privacy policy. You will be kept posted of any significant change
              of the privacy policy.
            </p>
            <br /><br />
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
}