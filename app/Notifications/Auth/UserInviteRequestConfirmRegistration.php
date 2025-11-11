<?php

namespace App\Notifications\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserInviteRequestConfirmRegistration extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $team;

    /**
     * Create a new notification instance.
     *
     * @param object $user
     * @param object $team
     */
    public function __construct($user)
    {
        $this->user = $user;
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
            ->subject(__('Registration Completed'))
            ->markdown('emails.auth.send-user-registration-confirmation', [
                'userName' => "{$this->user->name}",
                'email' => $notifiable->email,
            ]);
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => 'User Registration Complete',
            'user_id' => $this->user->id,
            'user_name' => "{$this->user->name}",
            'user_email' => $this->user->email,
            'sent_at' => now()->toDateTimeString(),
        ];
    }
}
