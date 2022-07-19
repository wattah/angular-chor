import { Injectable } from '@angular/core';
import { SAV } from '../constants/constants';

@Injectable({
    providedIn: 'root'
})
export class TaskNameVerificationService{
    private readonly adminSi = 'ADMINISTRATEUR_SI';
    private readonly desk = 'DESK';
    private readonly assistantCoach = 'ASSISTANT_COACH';
    rolesTaskOne = [
        this.adminSi,
        this.desk,
        'ZZZ_DESK',
        this.assistantCoach
    ];
    rolesTaskTwo = [
        'TECHNICIEN',
        this.adminSi,
        'SOUTIEN MULTIMEDIA',
        this.desk,
        this.assistantCoach
    ];
    rolesTaskThree = [
        'COACH',
        this.adminSi,
        this.desk,
        this.assistantCoach
    ];

    public verifyTaskByNameAndCurrentRoleName(name: string , roleName: string ) {
        return  (name.toLocaleUpperCase() === SAV.TASK_NAME_ONE.toLocaleUpperCase() 
                && this.rolesTaskOne.includes(roleName))
                ||
                (name.toLocaleUpperCase() === SAV.TASK_NAME_TWO.toLocaleUpperCase() 
                && this.rolesTaskTwo.includes(roleName))
                ||
                (name.toLocaleUpperCase() === SAV.TASK_NAME_THREE.toLocaleUpperCase() 
                && this.rolesTaskThree.includes(roleName));
    }

}
