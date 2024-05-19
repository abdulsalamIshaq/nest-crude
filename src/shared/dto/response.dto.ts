export class ResponseDto {
  success: boolean;
  code: number;
  message: string;
  data?: any;
  errors?: Array<string>;
}
