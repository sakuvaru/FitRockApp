import { BaseItem } from '../../../lib/repository';
import { User } from '../user.class';
import { Workout } from '../workouts/workout.class';
import { Location } from '../locations/location.class';

export class Appointment extends BaseItem {
    public appointmentName: string;
    public appointmentDate: Date;
    public notes: string;
    public workoutId: number | undefined;
    public clientId: number;
    public locationId: number;
    public appointmentLength: number;
    public appointmentEndDate: Date;

    public location: Location;
    public workout: Workout | undefined;
    public client: User;

}
