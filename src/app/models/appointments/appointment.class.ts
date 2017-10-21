import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';
import { Workout } from '../workouts/workout.class';

export class Appointment extends BaseItem {
    public appointmentName: string;
    public appointmentDate: Date;
    public notes: string;
    public workoutId: number | null;
    public clientId: number;

    public workout: Workout;
    public client: User;
}
