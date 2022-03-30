//User class before refactor

import axios,{AxiosResponse} from "axios";


interface UserProps{
    id?:number;//if id exists, user has backend representation
    name?:string;
    age?:number;    
}

//function annotation - no parameters, no return value
type Callback = () => void;

export class User{
    events: {[key:string]:Callback[]}= {};//we do not know beforehand the names of keys 
    //and all the keys will point to array of Callback type

    constructor(private data: UserProps){}

    
    get(propName:string):(string|number){
        return this.data[propName];
    }

    set(update:UserProps):void{
        Object.assign(this.data,update);
    }
    
    on(eventName:string,callback:Callback):void{
        //2 different cases
        //this.events[eventName]//Callback[] or undefined(default)
        const handlers = this.events[eventName] || [];//get list of registered events or empty array if undefined
        handlers.push(callback);
        this.events[eventName] = handlers;
    }

    trigger(eventName:string):void{
        const handlers = this.events[eventName];
        if(!handlers||handlers.length===0){
            return;
        }
        handlers.forEach(callback =>{
            callback();
        })
    }

    fetch():void{
        axios.get(`http://localhost:3000/users/${this.get('id')}`)
        .then((response:AxiosResponse):void=>{
            this.set(response.data);
        });
    }

    //
    save():void{
        const id = this.get('id');
        if(this.get('id')){
            //put - update
            axios.put(`http://localhost:3000/users/${id}`,this.data);
        }else{
            //post - create new
            axios.post('http://localhost:3000/users',this.data);
        }

    }
}