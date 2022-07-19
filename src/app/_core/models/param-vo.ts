import { EntityBase } from './entity-base';

export class ParamVo {

    id: number;
    className: string;

    constructor(id: number, className: string) {
        this.id = id;
        this.className = className;
    }
}