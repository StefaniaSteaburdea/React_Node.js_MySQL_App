import { useState, useEffect } from "react";

export function useLocalStorage(key:string,initialValue:object){
    //gets the value stored
    const [value, setValue]=useState(()=>{
        const jsonValue=localStorage.getItem(key);
        if(jsonValue!=null) return JSON.parse(jsonValue);
        return initialValue;
    });

    //sets the value stored
    useEffect(()=>{
        localStorage.setItem(key,JSON.stringify(value))
    }, [key,value])

    return [value,setValue] as [typeof value, typeof setValue];
}