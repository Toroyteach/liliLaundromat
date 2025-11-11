<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendUserForgotPasswordTokens extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $resetToken;

    public function __construct($user, $resetToken)
    {
        $this->user = $user;
        $this->resetToken = $resetToken;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Forgot Password Tokens'))
            ->markdown('emails.auth.send-user-forgot-password-tokens', [
                'userName' => "{$this->user->name}",
                'email' => $this->user->email,
                'token' => $this->resetToken,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'Forgot Password',
            'user_id' => $this->user->id,
            'user_email' => $this->user->email,
            'reset_token' => $this->resetToken,
            'requested_at' => now()->toDateTimeString(),
        ];
    }
}
