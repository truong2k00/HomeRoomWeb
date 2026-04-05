import { HTTP } from "@/HTTPServices";
import { BaseApi } from "../BaseApi";
import type { ChartAmountDto } from "@/models/AmountRate/ChartAmountDTO";


class AmountAPI extends BaseApi {
  GetDataChart() {
    return new Promise<ChartAmountDto[]>((resolve, reject) => {
      HTTP.get(`api/ChartAmount`)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  };
}
export default new AmountAPI();
