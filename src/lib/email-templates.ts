export function founderInviteHtml(name: string, inviteUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#f5f0e8;letter-spacing:2px;">Ceardaí</h1>
              <div style="width:40px;height:1px;background-color:#b5651d;margin:12px auto 0;"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:400;color:#1a1a1a;">You're Invited</h2>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#1a1a1a;">
                Hello ${name},
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#444444;">
                You've been personally invited to join <strong>Ceardaí</strong> as one of our 14 founding members. As a founder, you'll receive priority allocation on every batch, exclusive voting rights, and a permanent place in our story.
              </p>
              <p style="margin:0 0 32px;font-size:16px;line-height:1.6;color:#444444;">
                Click below to accept your invitation and claim your spot.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="background-color:#b5651d;border-radius:8px;">
                    <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;font-size:14px;font-family:sans-serif;color:#ffffff;text-decoration:none;letter-spacing:2px;text-transform:uppercase;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:32px 0 0;font-size:13px;line-height:1.6;color:#999999;">
                If the button doesn't work, copy and paste this link into your browser:<br />
                <a href="${inviteUrl}" style="color:#b5651d;word-break:break-all;">${inviteUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 40px;text-align:center;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#999999;letter-spacing:1px;">
                Ceardaí Craft Brewery
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function waitingListHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
              <h1 style="margin:0;font-size:28px;font-weight:400;color:#f5f0e8;letter-spacing:2px;">Ceardaí</h1>
              <div style="width:40px;height:1px;background-color:#b5651d;margin:12px auto 0;"></div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">
              <h2 style="margin:0 0 16px;font-size:22px;font-weight:400;color:#1a1a1a;">You're on the List</h2>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#1a1a1a;">
                Hello ${name},
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#444444;">
                All 14 founding member spots at <strong>Ceardaí</strong> are currently filled. You've been added to our waiting list and will be the first to know if a spot opens up.
              </p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#444444;">
                We'll send you an invitation as soon as a spot becomes available.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1a1a;padding:24px 40px;text-align:center;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#999999;letter-spacing:1px;">
                Ceardaí Craft Brewery
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
