import { SubjectDTO } from "@/models/Admin/Auth/SubjectDTO";
import { BaseApi } from "../BaseApi";
import { resolve } from "path";
import { HTTP } from "@/HTTPServices";

class SubjectAPI extends BaseApi{
  GetAll(keyword?: string){
    return new Promise<SubjectDTO[]>((resolve:any, reject:any)=>{
      HTTP.get('api/Subject', {params: {keyword: keyword}})
      .then((res)=>{
        resolve(res.data);
      })
      .catch((err)=>{})
    })
  }
}


export default new SubjectAPI();
