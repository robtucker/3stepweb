export class Log {

     debug(val) {
         if(!IS_PRODUCTION) {
             console.log(val);
         }
     }
    

}