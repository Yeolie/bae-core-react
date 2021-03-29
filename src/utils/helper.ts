export default {
    calculateSelectedIndex: (currentIndexSelected: number, currentIndexDeleted: number) => {
        let currentStepIndex = 0
        if (currentIndexSelected !== 0 && currentIndexDeleted !== 0) {
            // if not first message
            if (currentIndexSelected === currentIndexDeleted || currentIndexSelected - 1 === currentIndexDeleted) {
                // delete last message and message selected have current position is last message or near last
                currentStepIndex = currentIndexSelected - 1 // Move meassage selected back 1 step
            }
        }
        return currentStepIndex
    },
    renderColor: (data: number) => {
        let h = Math.floor(0.1 * data * 360) //hue is measured in degrees from 0-359
        let s = Math.floor(0.1 * data * 256) //saturation is a value from 0-255

        return `hsla(${h}, ${s}%, 50%, 1)`
    },
    getMessageResponse: (message: string): any => {
        if (!message) {
            return { message: "Something wrong. Please try again later!" }
        }

        return message?.split(", ")?.reduce((result, ele) => {
            let temp = ele.split("=")

            result[temp[0]] = temp[1]

            return result
        }, {})
    },
    getMessageError: (message: string): IMessageError => {
        if (!message) {
            return { message: "Something wrong. Please try again later!" }
        }

        return { message: message }
    },
    getMessageErrorRevert: (message: string): string => {
        if (!message) {
            return "Something wrong. Please try again later!"
        }

        const listError = message?.split(" - ")

        return listError[listError.length - 1]
    },
    log: (...args: any[]) => {
        if (process.env.NODE_ENV !== 'production') {
            console.log(...args)
        }
    }
}

interface IMessageError {
    message: string
}
