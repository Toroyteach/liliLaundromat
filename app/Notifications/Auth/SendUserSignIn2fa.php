<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendUserSignIn2fa extends Notification implements ShouldQueue
{
    use Queueable;


    protected $user;
    protected $token;

    public function __construct($user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Sign 2FA'))
            ->markdown('emails.auth.send-user-2fa-tokens', [
                'userName' => "{$this->user->name}",
                'email' => $this->user->email,
                'token' => $this->token,
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => '2FA Token',
            'user_id' => $this->user->id,
            'user_email' => $this->user->email,
            'generated_at' => now()->toDateTimeString(),
        ];
    }
}
