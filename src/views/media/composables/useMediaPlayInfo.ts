import { getPlayInfoApi, PlayInfoParams } from "@/request/api/media/playInfo";
import { PlayInfo } from "@/request/model/media/playInfo";
import { reactive } from "vue";

export function useMediaPlayInfo() {
  const mediaPlayInfo = reactive(<PlayInfo>{
    durl: [{}],
    timelength: 0
  })
  const getMediaPlayInfo = (params:PlayInfoParams) => new Promise<void>( async (resolve, reject) => {
    const data = await getPlayInfoApi(params)
    const { result } = data
    mediaPlayInfo.durl = result.durl
    mediaPlayInfo.timelength = result.timelength
    resolve()
  })  
  return { mediaPlayInfo, getMediaPlayInfo }
}