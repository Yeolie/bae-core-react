import React from "react"
import classnames from "classnames"
import * as Moment from "moment"
import Popover from "react-popover"
import MaskedInput from "react-text-mask"
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe"

import { DaysInMonth } from "./DaysInMonth"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDay, faTimes } from "@fortawesome/free-solid-svg-icons"

import "./index.scss"

const moment = Moment.default

interface InputDatePickerProps {
    onChange?: Function
    isInvalidDate?: Function
    isCustomDate?: Function
    startDate: Moment.Moment
    endDate: Moment.Moment
    minDate: Moment.Moment
    maxDate: Moment.Moment
    minYear: string
    maxYear: string
    // ranges: any
    opens: "right" | "left"
    drops: "above" | "right" | "below" | "left" | "row" | "column" | "start" | "end"
    locale: ILocale
    maxSpan: IMaxSpan
    dateLimit: number
    autoUpdateInput: boolean
    linkedCalendars: boolean
    showWeekNumbers: boolean
    showISOWeekNumbers: boolean
    singleDatePicker: boolean
    autoApply: boolean
    applyButtonClasses: string
    cancelButtonClasses: string
    disabled?: boolean

    uncontrolled?: boolean
    isShow?: boolean
    onClose?: Function
}

interface InputDatePickerStates {
    valueInput: string
    isShowing: boolean
    leftCalendar: any
    rightCalendar: any
    startDate: Moment.Moment
    endDate: Moment.Moment
    minDate: Moment.Moment
    maxDate: Moment.Moment
    minYear: string
    maxYear: string
    ranges: any
    opens: "right" | "left"
    drops: "above" | "right" | "below" | "left" | "row" | "column" | "start" | "end"
    locale: ILocale
    maxSpan: IMaxSpan
    dateLimit: number
    autoUpdateInput: boolean
    linkedCalendars: boolean
    showWeekNumbers: boolean
    showISOWeekNumbers: boolean
    singleDatePicker: boolean
    oldStartDate: Moment.Moment
    oldEndDate: Moment.Moment
    previousRightTime: Moment.Moment
    autoApply: boolean
    // dateSelected: string
    isDisabledBtnSubmit: boolean
}

export interface ILocale {
    direction: "ltr" | "rtl"
    format: string
    separator: string
    applyLabel: string
    cancelLabel: string
    weekLabel: string
    customRangeLabel: string
    daysOfWeek: string[]
    monthNames: string[]
    firstDay: number
}

interface IMaxSpan {
    days: number
}

export class InputDatePicker extends React.Component<InputDatePickerProps, InputDatePickerStates> {
    constructor(props: InputDatePickerProps) {
        super(props)

        let localeDefault = {
            direction: "ltr",
            format: Moment.localeData().longDateFormat("L"),
            separator: " - ",
            applyLabel: "Apply",
            cancelLabel: "Cancel",
            weekLabel: "W",
            customRangeLabel: "Custom Range",
            daysOfWeek: Moment.weekdaysMin(),
            monthNames: Moment.monthsShort(),
            firstDay: Moment.localeData().firstDayOfWeek(),
        }

        this.state = {
            isShowing: false,
            leftCalendar: {},
            rightCalendar: {},
            startDate: this.props.startDate,
            endDate: !this.props.singleDatePicker ? this.props.endDate : this.props.startDate,
            minDate: this.props.minDate,
            maxDate: this.props.maxDate,
            minYear: this.props.minYear,
            maxYear: this.props.maxYear,
            // ranges: this.props.ranges,
            opens: this.props.opens,
            drops: this.props.drops,
            locale: { ...localeDefault, ...this.props.locale },
            dateLimit: this.props.dateLimit,
            maxSpan: this.props.maxSpan,
            autoUpdateInput: this.props.autoUpdateInput,
            linkedCalendars: this.props.linkedCalendars,
            showWeekNumbers: this.props.showWeekNumbers,
            showISOWeekNumbers: this.props.showISOWeekNumbers,
            autoApply: this.props.autoApply,
            singleDatePicker: this.props.singleDatePicker,
            isDisabledBtnSubmit: true,
            valueInput: "",
            oldStartDate: null,
            oldEndDate: null,
            previousRightTime: null,
            // dateSelected: "",
            ranges: {
                "Hôm nay": [moment(), moment()],
                "Hôm qua": [moment().subtract(1, "days"), moment().subtract(1, "days")],
                "7 ngày trước": [moment().subtract(6, "days"), moment()],
                "30 ngày trước": [moment().subtract(29, "days"), moment()],
            },
        }

        // update day names order to firstDay
        if (this.state.locale.firstDay !== 0) {
            let iterator = this.state.locale.firstDay
            while (iterator > 0) {
                this.state.locale.daysOfWeek.push(this.state.locale.daysOfWeek.shift())
                iterator--
            }
        }
    }

    static defaultProps = {
        onChange: () => {},
        isInvalidDate: null,
        isCustomDate: null,
        startDate: moment().startOf("day"),
        endDate: moment().endOf("day"),
        minDate: null,
        maxDate: null,
        minYear: moment().subtract(100, "year").format("YYYY"),
        maxYear: moment().add(100, "year").format("YYYY"),
        // ranges: {},
        opens: "right",
        drops: "column",
        locale: {
            direction: "ltr",
            format: Moment.localeData().longDateFormat("L"),
            separator: " - ",
            applyLabel: "Áp dụng",
            cancelLabel: "Hủy",
            weekLabel: "W",
            customRangeLabel: "Tùy chỉnh phạm vi",
            daysOfWeek: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
            monthNames: [
                "Tháng một",
                "Tháng hai",
                "Tháng ba",
                "Tháng tư",
                "Tháng năm",
                "Tháng sáu",
                "Tháng bảy",
                "Tháng tám",
                "Tháng chín",
                "Tháng mười",
                "Tháng mười một",
                "Tháng mười hai",
            ],
            firstDay: Moment.localeData().firstDayOfWeek(),
        },
        dateLimit: null,
        maxSpan: null,
        autoUpdateInput: true,
        linkedCalendars: true,
        showWeekNumbers: false,
        showISOWeekNumbers: false,
        isDisabledBtnSubmit: true,
        singleDatePicker: false,
        autoApply: false,
        applyButtonClasses: "",
        cancelButtonClasses: "",
        disabled: false,
        uncontrolled: true,
        isShow: false,
        onClose: () => {},
    }

    private refDatePicker: HTMLDivElement = null
    private refInputDatePicker: HTMLDivElement = null
    private datepickerContainerRef: HTMLDivElement = null

    private setStartDate = (startDate: string | Moment.Moment, callback: Function = null) => {
        const { locale, minDate, maxDate } = this.state

        if (typeof startDate === "string") startDate = moment(startDate, locale.format)

        if (typeof startDate === "object") startDate = moment(startDate)

        if (minDate && startDate.isBefore(minDate)) {
            startDate = minDate.clone()
        }

        if (maxDate && startDate.isAfter(maxDate)) {
            startDate = maxDate.clone()
        }

        this.setState({ startDate }, () => {
            this.updateFormInputs()

            if (callback) callback()
        })
    }

    private setEndDate = (endDate: string | Moment.Moment, callback: Function = null) => {
        let { locale, maxDate, previousRightTime, startDate, maxSpan } = this.state

        if (typeof endDate === "string") endDate = moment(endDate, locale.format)

        if (typeof endDate === "object") endDate = moment(endDate)

        if (endDate.isBefore(startDate)) endDate = startDate.clone()

        if (maxDate && endDate.isAfter(maxDate)) endDate = maxDate.clone()

        if (maxSpan && startDate.clone().add(maxSpan).isBefore(endDate)) endDate = startDate.clone().add(maxSpan)

        previousRightTime = endDate.clone()

        this.setState({ endDate, previousRightTime }, () => {
            // this.updateTextDateSelected()
            this.updateFormInputs()

            if (callback) callback()
        })
    }

    private isInvalidDate = (data) => {
        return false
    }

    private isCustomDate = (data) => {
        return false
    }

    private calculateMonthsInView = () => {
        const {
            startDate,
            endDate,
            singleDatePicker,
            leftCalendar,
            rightCalendar,
            linkedCalendars,
            maxDate,
        } = this.state

        if (singleDatePicker && !startDate) {
            leftCalendar.month = moment().date(2)
            rightCalendar.month = moment().date(2).add(1, "month")

            return { leftCalendar, rightCalendar }
        }

        if (!singleDatePicker && !startDate && !endDate) {
            leftCalendar.month = moment().date(2).subtract(1, "month")
            rightCalendar.month = moment().date(2)

            return { leftCalendar, rightCalendar }
        }

        if (endDate) {
            //if both dates are visible already, do nothing
            if (
                !singleDatePicker &&
                leftCalendar.month &&
                rightCalendar.month &&
                (startDate.format("YYYY-MM") === leftCalendar.month.format("YYYY-MM") ||
                    startDate.format("YYYY-MM") === rightCalendar.month.format("YYYY-MM")) &&
                (endDate.format("YYYY-MM") === leftCalendar.month.format("YYYY-MM") ||
                    endDate.format("YYYY-MM") === rightCalendar.month.format("YYYY-MM"))
            ) {
                return { leftCalendar, rightCalendar }
            }

            leftCalendar.month = startDate.clone().date(2)

            if (!linkedCalendars && (endDate.month() !== startDate.month() || endDate.year() !== startDate.year())) {
                rightCalendar.month = endDate.clone().date(2)
            } else {
                rightCalendar.month = startDate.clone().date(2).add(1, "month")
            }
        } else {
            if (
                leftCalendar.month.format("YYYY-MM") !== startDate.format("YYYY-MM") &&
                rightCalendar.month.format("YYYY-MM") !== startDate.format("YYYY-MM")
            ) {
                leftCalendar.month = startDate.clone().date(2)
                rightCalendar.month = startDate.clone().date(2).add(1, "month")
            }
        }
        if (maxDate && linkedCalendars && !singleDatePicker && rightCalendar.month > maxDate) {
            rightCalendar.month = maxDate.clone().date(2)
            leftCalendar.month = maxDate.clone().date(2).subtract(1, "month")
        }

        return { leftCalendar, rightCalendar }
    }

    private calculateCalendar = (side, leftCalendar, rightCalendar) => {
        const { locale, minDate, maxDate } = this.state

        //
        // Build the matrix of dates that will populate the calendar
        //
        let calendar = side === "left" ? leftCalendar : rightCalendar

        let month = calendar.month.month()
        let year = calendar.month.year()
        let hour = calendar.month.hour()
        let minute = calendar.month.minute()
        let second = calendar.month.second()
        let daysInMonth = moment([year, month]).daysInMonth()
        let firstDay = moment([year, month, 1])
        let lastDay = moment([year, month, daysInMonth])
        let lastMonth = moment(firstDay).subtract(1, "month").month()
        let lastYear = moment(firstDay).subtract(1, "month").year()
        let daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth()
        let dayOfWeek = firstDay.day()

        //initialize a 6 rows x 7 columns array for the calendar
        let newCalendar = {} as any
        newCalendar.firstDay = firstDay
        newCalendar.lastDay = lastDay

        for (let i = 0; i < 6; i++) {
            calendar[i] = []
        }

        //populate the calendar with date objects
        let startDay = daysInLastMonth - dayOfWeek + locale.firstDay + 1
        if (startDay > daysInLastMonth) startDay -= 7

        if (dayOfWeek === locale.firstDay) startDay = daysInLastMonth - 6

        let curDate = moment([lastYear, lastMonth, startDay, 12, minute, second])

        for (let i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, "hour")) {
            if (i > 0 && col % 7 === 0) {
                col = 0
                row++
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second)
            curDate.hour(12)

            if (
                minDate &&
                calendar[row][col].format("YYYY-MM-DD") === minDate.format("YYYY-MM-DD") &&
                calendar[row][col].isBefore(minDate) &&
                side === "left"
            ) {
                calendar[row][col] = minDate.clone()
            }

            if (
                maxDate &&
                calendar[row][col].format("YYYY-MM-DD") === maxDate.format("YYYY-MM-DD") &&
                calendar[row][col].isAfter(maxDate) &&
                side === "right"
            ) {
                calendar[row][col] = maxDate.clone()
            }
        }

        //make the calendar object available to hoverDate/clickDate
        if (side === "left") {
            leftCalendar.calendar = calendar
        } else {
            rightCalendar.calendar = calendar
        }
        this.setState({ leftCalendar, rightCalendar })
    }

    private handleClickDate = (e, side, row, col) => {
        //This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation()

        const { leftCalendar, rightCalendar, startDate, endDate, autoApply, singleDatePicker } = this.state

        let date = side === "left" ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col]

        //
        // this function needs to do a few things:
        // * alternate between selecting a start and end date for the range,
        // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
        // * if autoapply is enabled, and an end date was chosen, apply the selection
        // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
        // * if one of the inputs above the calendars was focused, cancel that manual input
        //
        if (!startDate) {
            this.setStartDate(date.clone(), () => {
                if (singleDatePicker) {
                    this.setEndDate(date.clone(), () => {
                        this.clickApply()
                    })
                }
            })

            return
        }
        if (endDate || date.isBefore(startDate, "day")) {
            //picking start
            this.setState({ endDate: null }, () => {
                this.setStartDate(date.clone(), () => {
                    if (singleDatePicker) {
                        this.setEndDate(date.clone(), () => {
                            this.clickApply()
                        })
                    }
                })
            })
        } else if (!endDate && date.isBefore(startDate)) {
            //special case: clicking the same date for start/end,
            //but the time of the end date is before the start date
            this.setEndDate(startDate.clone())
        } else {
            // picking end
            this.setEndDate(date.clone(), () => {
                if (autoApply) {
                    this.clickApply()
                }
            })
        }
    }

    private clickPrev = () => {
        const { leftCalendar, rightCalendar } = this.state
        leftCalendar.month = leftCalendar.month.subtract(1, "month")
        rightCalendar.month = rightCalendar.month.subtract(1, "month")

        this.setState({ leftCalendar, rightCalendar }, () => {
            this.updateCalendars()
        })
    }

    private clickNext = () => {
        const { leftCalendar, rightCalendar } = this.state
        leftCalendar.month = leftCalendar.month.clone().add(1, "month")
        rightCalendar.month = rightCalendar.month.clone().add(1, "month")

        this.setState({ leftCalendar, rightCalendar }, () => {
            this.updateCalendars()
        })
    }

    private updateCalendars = () => {
        const { leftCalendar, rightCalendar } = this.state

        this.calculateCalendar("left", leftCalendar, rightCalendar)
        this.calculateCalendar("right", leftCalendar, rightCalendar)
    }

    private updateFormInputs = () => {
        const { singleDatePicker, startDate, endDate } = this.state
        if (singleDatePicker || (endDate && (startDate?.isBefore(endDate) || startDate?.isSame(endDate)))) {
            this.setState({ isDisabledBtnSubmit: false })
        } else {
            this.setState({ isDisabledBtnSubmit: true })
        }
    }

    // private updateTextDateSelected = () => {
    //     const { startDate, endDate, locale } = this.state

    //     let dateSelected = startDate.format("DD/MM/YYYY") + locale.separator + endDate.format("DD/MM/YYYY")

    //     this.setState({ dateSelected })
    // }

    private renderCalendar = (side, leftCalendar, rightCalendar) => {
        if (!leftCalendar.month || !rightCalendar.month) return

        const { isInvalidDate, isCustomDate } = this.props
        const {
            minDate,
            maxDate,
            startDate,
            endDate,
            locale,
            linkedCalendars,
            maxSpan,
            showWeekNumbers,
            showISOWeekNumbers,
            singleDatePicker,
        } = this.state

        let calendar = side === "left" ? leftCalendar : rightCalendar
        // let minDateClone = side === "left" ? minDate : startDate
        let maxDateClone = maxDate

        const renderHeader = () => (
            <thead>
                <tr>
                    {(showWeekNumbers || showISOWeekNumbers) && <th></th>}
                    {
                        // (!minDateClone || minDateClone.isBefore(calendar.firstDay)) &&
                        !linkedCalendars || side === "left" ? (
                            <th className="prev available" onClick={this.clickPrev}>
                                <span></span>
                            </th>
                        ) : (
                            <th></th>
                        )
                    }
                    <th colSpan={5} className="month">
                        {locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY")}
                    </th>
                    {
                        // (!maxDateClone || maxDateClone.isAfter(calendar.lastDay)) &&
                        !linkedCalendars || side === "right" || singleDatePicker ? (
                            <th className="next available" onClick={this.clickNext}>
                                <span></span>
                            </th>
                        ) : (
                            <th></th>
                        )
                    }
                </tr>
                <tr>
                    {(showWeekNumbers || showISOWeekNumbers) && <th className="week">{locale.weekLabel}</th>}
                    {locale.daysOfWeek.map((dayOfWeek, index) => (
                        <th key={index}>{dayOfWeek}</th>
                    ))}
                </tr>
            </thead>
        )

        //adjust maxDate to reflect the maxSpan setting in order to
        //grey out end dates beyond the maxSpan
        if (endDate === null && startDate !== null && maxSpan) {
            let maxLimit = startDate.clone().add(maxSpan).endOf("day")
            if (!maxDateClone || maxLimit.isBefore(maxDateClone)) {
                maxDateClone = maxLimit
            }
        }

        return (
            <table className="table-condensed">
                {renderHeader()}
                <tbody>
                    {[0, 1, 2, 3, 4, 5].map((row, index) => (
                        <tr key={index}>
                            {showWeekNumbers ? (
                                <td className="week">{calendar[row][0].week()}</td>
                            ) : showISOWeekNumbers ? (
                                <td className="week">{calendar[row][0].isoWeek()}</td>
                            ) : null}
                            {[0, 1, 2, 3, 4, 5, 6].map((col, index) => (
                                <DaysInMonth
                                    key={index}
                                    side={side}
                                    calendar={calendar}
                                    col={col}
                                    row={row}
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={minDate}
                                    maxDate={maxDateClone}
                                    isInvalidDate={isInvalidDate ? isInvalidDate : this.isInvalidDate}
                                    isCustomDate={isCustomDate ? isCustomDate : this.isCustomDate}
                                    onClick={this.handleClickDate}
                                />
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    private updateInputElementValue = () => {
        const { autoUpdateInput, startDate, endDate, locale, singleDatePicker } = this.state
        if (autoUpdateInput) {
            let newValue = startDate?.format("DD/MM/YYYY") ?? ""

            if (!singleDatePicker) {
                let endDateFormated = endDate?.format("DD/MM/YYYY") ?? ""
                if (endDateFormated) newValue += locale.separator + endDateFormated
            }

            if (!newValue) newValue = "Chọn thời gian"

            this.setState({ valueInput: newValue })
        }
    }

    private handleKeyDown = (e) => {
        //hide on tab or enter
        if (e.keyCode === 9 || e.keyCode === 13) {
            this.setState({ isShowing: false })
        }

        //hide on esc and prevent propagation
        if (e.keyCode === 27) {
            e.preventDefault()
            e.stopPropagation()

            this.setState({ isShowing: false })
        }
    }

    private clickApply = () => {
        this.handleClose()
    }

    private clickCancel = () => {
        const { oldStartDate, oldEndDate } = this.state

        this.setState({ startDate: oldStartDate, endDate: oldEndDate }, () => {
            this.handleClose()
        })
    }

    private handleShow = () => {
        const { startDate, endDate, isShowing } = this.state

        if (isShowing) return

        let oldStartDate = startDate
        let oldEndDate = endDate
        let previousRightTime = endDate

        this.setState({
            isShowing: true,
            oldStartDate,
            oldEndDate,
            previousRightTime,
        })
    }

    private handleClose = () => {
        const { isShowing, oldStartDate, oldEndDate, startDate, endDate, singleDatePicker } = this.state

        if (!isShowing) return

        let currentStartDate = startDate
        let currentEndDate = endDate

        //incomplete date selection, revert to last values
        if (!endDate) {
            currentStartDate = oldStartDate?.clone()
            currentEndDate = oldEndDate?.clone()
        }

        if (singleDatePicker) {
            if (!currentStartDate) {
                this.setState({ isShowing: false }, () => {
                    this.updateInputElementValue()
                })

                return
            }
        } else {
            if (!currentStartDate && !currentEndDate) {
                this.setState({ isShowing: false }, () => {
                    this.updateInputElementValue()
                })

                return
            }
        }

        //if a new date range was selected, invoke the user onchange function
        if (!currentStartDate.isSame(oldStartDate) || !currentEndDate.isSame(oldEndDate)) {
            currentStartDate.set({ hour: 0, minute: 0, second: 0 })
            currentEndDate.set({ hour: 23, minute: 59, second: 59 })

            this.props.onChange(currentStartDate, currentEndDate)
        }

        this.setState(
            {
                isShowing: false,
                startDate: currentStartDate,
                endDate: currentEndDate,
            },
            () => {
                this.updateInputElementValue()
            }
        )

        this.props.onClose()
    }

    private handleClickOutside = (event) => {
        this.clickCancel()
    }

    private checkRangesActive = (range) => {
        const { startDate, endDate } = this.state

        if (!startDate || !endDate) return false

        if (
            startDate.format("YYYY-MM-DD") === range[0].format("YYYY-MM-DD") &&
            endDate.format("YYYY-MM-DD") === range[1].format("YYYY-MM-DD")
        ) {
            return true
        }

        return false
    }

    private handleClickRanges = (range) => {
        const { locale } = this.props

        let startDate = moment(range[0], locale.format)
        let endDate = moment(range[1], locale.format)

        this.setStartDate(startDate, () => {
            this.setEndDate(endDate, () => {
                const { leftCalendar, rightCalendar } = this.calculateMonthsInView()
                this.calculateCalendar("left", leftCalendar, rightCalendar)
                this.calculateCalendar("right", leftCalendar, rightCalendar)
            })
        })
    }

    private handleChangeStartDate = (event) => {
        let value = event?.target?.value ?? ""

        if (/^\d\d\/\d\d\/\d\d\d\d$/i.test(value)) {
            const { startDate, endDate } = this.state
            let dateFormated = moment(value, "DD/MM/YYYY")

            if (dateFormated.isAfter(endDate)) {
                dateFormated = startDate
            }

            this.setStartDate(dateFormated)
        }
    }

    private handleChangeEndDate = (event) => {
        let value = event?.target?.value ?? ""

        if (/^\d\d\/\d\d\/\d\d\d\d$/i.test(value)) {
            const { startDate, endDate } = this.state
            let dateFormated = moment(value, "DD/MM/YYYY")

            if (dateFormated.isBefore(startDate)) {
                dateFormated = endDate
            }

            this.setStartDate(dateFormated)
        }
    }

    private clearData = () => {
        this.setState(
            {
                startDate: null,
                endDate: null,
            },
            () => {
                this.updateInputElementValue()
            }
        )
        this.props.onChange(null, null)
    }

    private isExistValue = (singleDatePicker: boolean, startDate, endDate) => {
        if (singleDatePicker) {
            if (startDate) return true
            return false
        } else {
            if (startDate && endDate) return true
            return false
        }
    }

    componentDidUpdate(prevProps: InputDatePickerProps) {
        if (prevProps.startDate !== this.props.startDate || prevProps.endDate !== this.props.endDate) {
            this.setState(
                {
                    startDate: this.props.startDate,
                    endDate: !this.props.singleDatePicker ? this.props.endDate : this.props.startDate,
                },
                () => {
                    this.updateInputElementValue()
                    const { leftCalendar, rightCalendar } = this.calculateMonthsInView()
                    this.calculateCalendar("left", leftCalendar, rightCalendar)
                    this.calculateCalendar("right", leftCalendar, rightCalendar)
                }
            )
        }
    }

    componentDidMount() {
        this.updateInputElementValue()

        const { leftCalendar, rightCalendar } = this.calculateMonthsInView()
        this.calculateCalendar("left", leftCalendar, rightCalendar)
        this.calculateCalendar("right", leftCalendar, rightCalendar)

        document.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown)
    }

    render() {
        const { applyButtonClasses, cancelButtonClasses, disabled, uncontrolled, isShow: isShowProps } = this.props
        const {
            valueInput,
            leftCalendar,
            rightCalendar,
            isDisabledBtnSubmit,
            isShowing,
            locale,
            singleDatePicker,
            opens,
            autoApply,
            ranges,
            startDate,
            endDate,
            drops,
        } = this.state

        const buttonClasses = classnames("btn btn-sm")
        const applyBtnClasses = classnames("applyBtn btn-primary", buttonClasses, applyButtonClasses)
        const cancelBtnClasses = classnames("cancelBtn btn-default", buttonClasses, cancelButtonClasses)

        return (
            <React.Fragment>
                <div
                    ref={(c) => (this.datepickerContainerRef = c)}
                    style={{ top: 0, left: 0, position: "fixed", zIndex: 9999 }}
                ></div>
                <Popover
                    isOpen={uncontrolled ? isShowing : isShowProps}
                    preferPlace={drops}
                    onOuterAction={this.handleClickOutside}
                    tipSize={0.01}
                    style={{ zIndex: "9999" }}
                    appendTarget={this.datepickerContainerRef !== null ? this.datepickerContainerRef : document.body}
                    target={null}
                    body={
                        <div
                            className={classnames("daterangepicker", "opens" + opens, {
                                "show-calendar": isShowing,
                                "auto-apply": autoApply || singleDatePicker,
                                single: singleDatePicker,
                            })}
                        >
                            {!singleDatePicker && (
                                <div className="ranges">
                                    <div className="ranges-container">
                                        {Object.keys(ranges).map((key, index) => (
                                            <div
                                                key={index}
                                                className={classnames("ranges-item", {
                                                    active: this.checkRangesActive(ranges[key]),
                                                })}
                                                onClick={() => this.handleClickRanges(ranges[key])}
                                            >
                                                {key}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="drp-calendar-wrapper">
                                <div className="drp-calendar-container">
                                    <div
                                        className={classnames("drp-calendar left", {
                                            single: singleDatePicker,
                                        })}
                                    >
                                        <div className="calendar-table">
                                            {this.renderCalendar("left", leftCalendar, rightCalendar)}
                                        </div>
                                        <div className="calendar-time"></div>
                                    </div>
                                    <div
                                        className="drp-calendar right"
                                        style={{
                                            display: singleDatePicker ? "none" : "block",
                                        }}
                                    >
                                        <div className="calendar-table">
                                            {this.renderCalendar("right", leftCalendar, rightCalendar)}
                                        </div>
                                        <div className="calendar-time"></div>
                                    </div>
                                </div>
                                <div className="drp-buttons">
                                    {/* <span className="drp-selected">{dateSelected}</span> */}
                                    <div className="input-date-container">
                                        <MaskedInput
                                            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                                            pipe={createAutoCorrectedDatePipe("dd/mm/yyyy")}
                                            className="form-control input-date"
                                            value={startDate?.format("DD/MM/YYYY")}
                                            onChange={this.handleChangeStartDate}
                                        />
                                        <span className="input-hyphen">—</span>
                                        <MaskedInput
                                            mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
                                            pipe={createAutoCorrectedDatePipe("dd/mm/yyyy")}
                                            className="form-control input-date"
                                            value={endDate?.format("DD/MM/YYYY")}
                                            onChange={this.handleChangeEndDate}
                                        />
                                    </div>
                                    <div>
                                        <button className={cancelBtnClasses} type="button" onClick={this.clickCancel}>
                                            {locale.cancelLabel}
                                        </button>
                                        <button
                                            className={applyBtnClasses}
                                            disabled={isDisabledBtnSubmit}
                                            type="button"
                                            onClick={this.clickApply}
                                        >
                                            {locale.applyLabel}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                >
                    <div
                        className={classnames("input-daterangepicker pointer", {
                            focus: isShowing,
                            value: this.isExistValue(singleDatePicker, startDate, endDate),
                            disabled: disabled,
                        })}
                    >
                        <div className="input-daterangepicker-data" onClick={!disabled ? this.handleShow : undefined}>
                            {valueInput}
                            {!this.isExistValue(singleDatePicker, startDate, endDate) && (
                                <FontAwesomeIcon className="input-daterangepicker-icon icon-16" icon={faCalendarDay} />
                            )}
                        </div>
                        {this.isExistValue(singleDatePicker, startDate, endDate) && !disabled && (
                            <FontAwesomeIcon
                                className="input-daterangepicker-icon icon-clear"
                                icon={faTimes}
                                onClick={!disabled && this.clearData}
                            />
                        )}
                    </div>
                </Popover>
            </React.Fragment>
        )
    }
}
