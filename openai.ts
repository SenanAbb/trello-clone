import Configuration from "openai"
import OpenAIAPI from "openai"
import { ClientOptions } from "openai"

//@ts-ignore
const options: ClientOptions = process.env.OPENAI_API_KEY

const openai = new OpenAIAPI(options)

export default openai;