
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Hospital_Backend.Services;

public class EmailService
{
    private readonly EmailSettings _settings;

    public EmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendVerificationEmailAsync(
        string recipientEmail,
        string verificationLink)
    {
        var message = new MimeMessage();

        message.From.Add(
            new MailboxAddress("Hospital Management System", _settings.Email));

        message.To.Add(
            MailboxAddress.Parse(recipientEmail));

        message.Subject = "E-posta Adresinizi Doğrulayın";

        message.Body = new BodyBuilder
        {
            HtmlBody = $"""
                <h2>Hesabınızı doğrulayın</h2>
                <p>Hospital Management System'e kayıt olduğunuz için teşekkür ederiz.</p>
                <p>Hesabınızı etkinleştirmek için aşağıdaki bağlantıya tıklayın:</p>
                <p><a href="{System.Net.WebUtility.HtmlEncode(verificationLink)}">
                    E-posta Adresimi Doğrula
                </a></p>
                <p>Bu işlemi siz yapmadıysanız bu e-postayı dikkate almayabilirsiniz.</p>
                """
        }.ToMessageBody();

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            "smtp.gmail.com",
            587,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            _settings.Email,
            _settings.AppPassword);

        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
    }
}
