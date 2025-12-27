'use client';

import styles from '../shared/InvoiceForm.module.css';

export default function InvoiceCreatePage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageGrid}>

        {/* ───────── Top Toolbar ───────── */}
        <div className={styles.toolbar}>
          <div className={styles.segmented}>
            <button className={styles.segment}>Preview</button>
            <button className={`${styles.segment} ${styles.active}`}>Edit</button>
          </div>

          <div className={styles.toolbarActions}>
            <button className={styles.toolbarBtn}>Payment scheduling</button>
            <button className={styles.toolbarBtn}>PDF</button>
            <button className={`${styles.toolbarBtn} ${styles.primary}`}>
              Email Invoice
            </button>
          </div>
        </div>

        {/* ───────── Header ───────── */}
        <div className={styles.headerGrid}>
          <div className={styles.headerTitle}>
            <input
              className={styles.invoiceTitle}
              defaultValue="Invoice"
            />
          </div>

          <div className={styles.headerLogo}>
            <div className={styles.logoBox}>+ Logo</div>
          </div>
        </div>

        {/* ───────── Identity (2×2) ───────── */}
        <div className={styles.identityGridWrap}>
          <div className={styles.identityGrid}>

            {/* From */}
            <section className={styles.identityBox}>
              <h3>From</h3>

              <div className={styles.formRow}>
                <label>Name</label>
                <input defaultValue="Jay" />
              </div>

              <div className={styles.formRow}>
                <label>Email</label>
                <input defaultValue="jay@gmail.com" />
              </div>

              <div className={styles.formRow}>
                <label>Address</label>
                <div className={styles.stack}>
                  <input defaultValue="234" />
                  <input defaultValue="Perth" />
                  <input defaultValue="6000" />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Phone</label>
                <input defaultValue="0487345345" />
              </div>

              <div className={styles.formRow}>
                <label>ABN</label>
                <input defaultValue="53 654 789" />
              </div>

              <button className={styles.inlineLink}>
                Edit additional business details
              </button>
            </section>

            {/* Bill To */}
            <section className={styles.identityBox}>
              <h3>Bill To</h3>

              <div className={styles.formRow}>
                <label>Name</label>
                <input placeholder="Client Name" />
              </div>

              <div className={styles.formRow}>
                <label>Email</label>
                <input placeholder="name@client.com" />
              </div>

              <div className={styles.formRow}>
                <label>Address</label>
                <input placeholder="Street" />
              </div>

              <div className={styles.formRow}>
                <label>Phone</label>
                <input placeholder="(123) 456 789" />
              </div>
            </section>

            {/* Invoice Details */}
            <section className={styles.identityBox}>
              <h3>Invoice Details</h3>

              <div className={styles.formRow}>
                <label>Number</label>
                <input defaultValue="INV0004" />
              </div>

              <div className={styles.formRow}>
                <label>Date</label>
                <input defaultValue="Oct 20, 2025" />
              </div>

              <div className={styles.formRow}>
                <label>Terms</label>
                <select>
                  <option>Custom</option>
                  <option>Net 30</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Due</label>
                <input defaultValue="Oct 21, 2025" />
              </div>

              <button className={styles.inlineLink}>
                + Add another input preference
              </button>
            </section>

            {/* Project Details */}
            <section className={styles.identityBox}>
              <h3>Project Details</h3>

              <div className={styles.formRow}>
                <label>Project</label>
                <select>
                  <option>Select project</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Site</label>
                <div className={styles.stack}>
                  <input placeholder="Street" />
                  <input placeholder="City" />
                  <input placeholder="Postcode" />
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* ───────── Items Table ───────── */}
        <div className={styles.itemsSection}>
          <div className={styles.itemsHeader}>
            <div>Description</div>
            <div>Rate</div>
            <div>Qty</div>
            <div>Amount</div>
            <div>GST</div>
          </div>

          <div className={styles.itemsBody}>
            <div className={styles.itemRow}>
              <button className={styles.removeItem}>×</button>

              <div className={styles.itemDescription}>
                <input
                  className={styles.formInput}
                  placeholder="Item description"
                />
                <textarea
                  className={styles.formTextarea}
                  rows={2}
                  placeholder="Additional details"
                />
              </div>

              <input className={styles.formInput} defaultValue="0.00" />
              <input className={styles.formInput} defaultValue="1" />
              <div className={styles.amountCell}>$0.00</div>

              <div className={styles.gstCell}>
                <input type="checkbox" />
              </div>
            </div>
          </div>

          <div className={styles.addItemRow}>
            <button className={styles.addItemBtn}>+</button>
          </div>
        </div>

        {/* ───────── Totals ───────── */}
        <div className={styles.totalsWrap}>
          <div className={styles.totals}>
            <div><span>Subtotal</span><span>$0.00</span></div>
            <div><span>GST (10%)</span><span>$0.00</span></div>
            <div className={styles.total}><span>Total</span><span>$0.00</span></div>
            <div className={styles.balance}><span>Balance Due</span><span>$0.00</span></div>
          </div>
        </div>

        {/* ───────── Notes / Signature / Photos ───────── */}
        <div className={styles.fullWidth}>
          <label className={styles.sectionLabel}>Notes</label>
          <textarea
            className={styles.notes}
            placeholder="Notes – any relevant information not covered, additional terms and conditions"
          />

          <div className={styles.signatureRow}>
            <span>🔒 Signature</span>
            <button className={styles.addSmallBtn}>+</button>
          </div>

          <div className={styles.photosBlock}>
            <span className={styles.sectionLabel}>Photos</span>
            <div className={styles.photoBox}>🔒 Add Photo</div>
          </div>
        </div>
{/* ───────── Footer Actions ───────── */}
<div className={styles.footerActions}>
  <button className={styles.footerBtn}>
    Close Invoice
  </button>

  <button className={styles.footerBtn}>
    Delete Invoice
  </button>
</div>

      </div>
    </div>
          
);
}
