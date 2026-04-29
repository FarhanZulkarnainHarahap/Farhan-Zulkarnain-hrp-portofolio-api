export const contactEmailTemplate = (name: string, email: string, message: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .container {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #030406;
        color: #ffffff;
        padding: 40px 20px;
        max-width: 600px;
        margin: auto;
        border-radius: 24px;
        border: 1px solid #1e293b;
        animation: slideIn 1s ease-out;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .badge {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        padding: 8px 16px;
        border-radius: 100px;
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .content {
        background: rgba(255, 255, 255, 0.03);
        padding: 30px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
      .field {
        margin-bottom: 20px;
      }
      .label {
        color: #64748b;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 5px;
      }
      .value {
        color: #f8fafc;
        font-size: 14px;
        font-style: italic;
      }
      .message-box {
        margin-top: 20px;
        padding: 20px;
        background: #0f172a;
        border-left: 4px solid #3b82f6;
        border-radius: 8px;
        color: #cbd5e1;
        line-height: 1.6;
        font-size: 14px;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        color: #475569;
        font-size: 10px;
        letter-spacing: 1px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <span class="badge">New Connection</span>
        <h1 style="color: #ffffff; margin-top: 15px; letter-spacing: -1px;">Incoming <span style="color: #3b82f6;">Message.</span></h1>
      </div>
      
      <div class="content">
        <div class="field">
          <div class="label">From Client</div>
          <div class="value">${name}</div>
        </div>
        <div class="field">
          <div class="label">Email Address</div>
          <div class="value" style="color: #3b82f6;">${email}</div>
        </div>
        <div class="field">
          <div class="label">The Message</div>
          <div class="message-box">
            ${message}
          </div>
        </div>
      </div>

      <div class="footer">
        © 2026 Portfolio System • Creative Developer
      </div>
    </div>
  </body>
  </html>
  `;
};
