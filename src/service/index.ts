import { Notify } from "quasar";


export function notification(message: string,type: 'negative' | 'positive' | 'warning'='positive')
{
	Notify.create({message,type,progress: true,
    actions:[{icon: 'close',round: true,color: 'white'}],timeout: 5000,position: 'top'})
}
