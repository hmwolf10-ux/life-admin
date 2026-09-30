/* Plain how-to guides. Generic examples only; no real names or numbers. */
export const GUIDES = [
  { id: 'checks', title: 'Check handling', blurb: 'Write, endorse, void, and deposit a paper check.', html: `
<h2>Writing a check</h2>
<table><tr><th>Field</th><th>What to do</th></tr>
<tr><td>Date</td><td>Top right. The day you write it.</td></tr>
<tr><td>Pay to the order of</td><td>The full legal name of the person or business.</td></tr>
<tr><td>Amount in numbers</td><td>Write close to the $ sign so nothing can be added in front.</td></tr>
<tr><td>Amount in words</td><td>Spell it out, for example "One hundred twenty-five and 00/100". Draw a line through any unused space.</td></tr>
<tr><td>Memo</td><td>Optional. What it is for, or an account number.</td></tr>
<tr><td>Signature</td><td>Bottom right. It must match the signature your bank has on file or the check can bounce.</td></tr></table>
<h2>Endorsing a check you received</h2>
<table><tr><th>Type</th><th>What to write on the back</th><th>Use it when</th></tr>
<tr><td>Blank</td><td>Just your signature</td><td>You are depositing in person right now. It acts like cash if lost.</td></tr>
<tr><td>Restrictive</td><td>"For deposit only", your account number, then your signature</td><td>Mobile deposits and any other deposit. The safest option.</td></tr>
<tr><td>Third party</td><td>"Pay to the order of [name]", then your signature</td><td>Signing a check over to someone. Some banks refuse these, so call first.</td></tr></table>
<p>Sign within about 1.5 inches of the top edge on the back. Below that is reserved for bank stamps. Never endorse a check until you are ready to deposit it the same day.</p>
<h2>Voiding a check</h2>
<ul><li>Write VOID in large letters across the front, touching the amount box and the signature line.</li><li>Do not sign it.</li><li>Mark the check number as void in your register so it is not reused.</li><li>Common reasons: setting up direct deposit or autopay (the bank needs the routing and account numbers), or a check written in error.</li></ul>
<h2>Depositing</h2>
<ul><li><b>Mobile:</b> endorse with "For deposit only", photograph the front and back flat with all four corners visible, and submit in your bank's app.</li><li><b>ATM or teller:</b> endorse the back and bring a deposit slip if required.</li><li>Keep the paper check for about 5 to 14 days after a mobile deposit until it clears, then shred it.</li><li>Large or unusual checks can trigger a hold, so the funds may take longer to become available.</li></ul>` },
  { id: 'mail', title: 'Mail prep', blurb: 'Addressing, postage, sealing, and tracking versus certified mail.', html: `
<h2>Addressing an envelope</h2>
<ul><li><b>Return address:</b> top left. Your name and address, so it can come back if undeliverable.</li><li><b>Stamp:</b> top right corner only.</li><li><b>Recipient:</b> centered, slightly right and below the middle. This is what the scanner reads.</li><li><b>Certified or tracking label:</b> placed by the clerk, usually on the left near the address.</li></ul>
<h2>Postage</h2>
<ul><li>A standard letter (1 oz, up to a quarter inch thick) takes one Forever stamp.</li><li>Each additional ounce needs more postage. Weigh anything with more than 2 or 3 sheets of paper, or a card.</li><li>Square, oversized, or rigid envelopes can need a surcharge.</li><li>When in doubt, have it weighed at the post office counter rather than guessing.</li></ul>
<h2>Sealing</h2>
<ul><li>Insert the contents with folds facing the back of the envelope, not the flap opening.</li><li>Press the flap down firmly along its whole length.</li><li>For checks, cash, or legal documents, tape the flap corners.</li></ul>
<h2>Tracking or certified</h2>
<table><tr><th>Option</th><th>What you get</th><th>Use it for</th></tr>
<tr><td>Tracking</td><td>Delivery confirmation and location updates online</td><td>Packages and anything you want to confirm arrived</td></tr>
<tr><td>Certified mail</td><td>Proof of mailing, a signature at delivery, and a legal delivery record</td><td>Legal notices, tax documents, contracts, anything needing proof of receipt</td></tr></table>
<p>Certified mail needs a green USPS Form 3800 sticker and a receipt at the counter, so it cannot go in a mailbox. Add Return Receipt if you want the recipient's signature mailed back to you.</p>` },
  { id: 'records', title: 'What to keep and for how long', blurb: 'A quick retention guide for paperwork.', html: `
<table><tr><th>Keep</th><th>How long</th></tr>
<tr><td>Tax returns and supporting documents</td><td>At least 3 years, 7 if you claimed a loss or bad debt. Keep the returns themselves indefinitely.</td></tr>
<tr><td>Pay stubs</td><td>Until you have checked them against your W-2, then shred.</td></tr>
<tr><td>Bank and card statements</td><td>1 year, longer for anything tied to a tax deduction.</td></tr>
<tr><td>Receipts for big purchases and warranties</td><td>For the life of the warranty or the item.</td></tr>
<tr><td>Loan documents</td><td>Until the loan is paid off, plus proof of payoff.</td></tr>
<tr><td>Insurance policies</td><td>While active. Keep claim records for several years.</td></tr>
<tr><td>Vehicle title and registration</td><td>As long as you own the vehicle.</td></tr>
<tr><td>Birth certificate, Social Security card, passport, wills</td><td>Permanently, stored safely.</td></tr></table>
<p>These are common guidelines, not legal advice. Shred anything with account numbers before throwing it out.</p>` }
];
