import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface IAction {
    type: string;
    payload?: any;
    state?: any;
}

export class Store {
    protected state = {};
    protected $onChange: Subject<IAction> = new Subject();

    protected next(type: IAction) {
        this.$onChange.next({ ...type, state: this.state });
    }

    public on(type: string = null): Observable<IAction> {
        if (type) {
            return this.$onChange.pipe(
                filter((action: IAction) => action.type === type)
            );
        } else {
            return this.$onChange;
        }
    }

    public setState(payload: any) {
        Object.keys(payload).forEach((key: string) => {
            this.state = { ...this.state, [key]: payload[key] };
        });
        return this;
    }

    public mapState(obj: any, attrs: string[]) {
        attrs.forEach((attr) => {
            obj[attr] = this.state[attr];
        });
        return this.$onChange
            .pipe(
                map((item: any) => {
                    attrs.forEach((attr) => {
                        obj[attr] = item.state[attr];
                    });
                    return item.state;
                })
            )
            .subscribe(() => { });
    }
}
