<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendUserConfirmPasswordChange extends Notification
{
    use Queueable;

    protected $user;

    public function __construct($user)
    {
        $this->user = $user;
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
            ->subject(__('Password Change Success'))
            ->markdown('emails.auth.send-user-successful-password-change', [
                'userName' => "{$this->user->name}",
                'email' => $this->user->email,
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
            'type' => 'Password Reset Success',
            'user_id' => $this->user->id,
            'user_email' => $this->user->email,
            'reset_at' => now()->toDateTimeString(),
        ];
    }
}
