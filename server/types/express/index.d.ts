import { Request } from 'express';
declare global{
    declare namespace Express{
        interface Request{
            admin? : String,
            user? : String
        }
    }
}
