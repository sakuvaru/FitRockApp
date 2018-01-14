import { BoxColors } from './box-colors';

class BoxHelper {
    getClassName(color: BoxColors | undefined): string {
        const defaultClass: string = 'box-primary';

        if (!color) {
            return defaultClass;
        }

        if (color === BoxColors.Primary) {
            return 'box-primary';
        } else if (color === BoxColors.Accent) {
            return 'box-accent';
        } else if (color === BoxColors.Blue) {
            return 'box-blue';
        } else if (color === BoxColors.Purple) {
            return 'box-purple';
        } else if (color === BoxColors.Orange) {
            return 'box-orange';
        } else if (color === BoxColors.Yellow) {
            return 'box-yellow';
        } else if (color === BoxColors.Cyan) {
            return 'box-cyan';
        } 
    
        return defaultClass;
    }
}

export const boxHelper = new BoxHelper();

