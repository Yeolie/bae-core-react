import React from "react"
import * as Moment from "moment"

import "./index.scss"

interface DaysInMonthProps {
    calendar: any
    side: "left" | "right"
    col: number
    row: number
    startDate: Moment.Moment
    endDate: Moment.Moment
    minDate: Moment.Moment
    maxDate: Moment.Moment
    isInvalidDate?: Function
    isCustomDate?: Function
    onClick?: Function
}

export const DaysInMonth: React.FC<DaysInMonthProps> = (props) => {
    const { calendar, row, col, startDate, endDate, minDate, maxDate, isInvalidDate, isCustomDate, side } = props
    let classes = []

    //highlight today's date
    if (calendar[row][col].isSame(new Date(), "day")) classes.push("today")

    //highlight weekends
    if (calendar[row][col].isoWeekday() > 5) classes.push("weekend")

    //grey out the dates in other months displayed at beginning and end of this calendar
    if (calendar[row][col].month() !== calendar[1][1].month()) classes.push("off", "ends")

    //don't allow selection of dates before the minimum date
    if (minDate && calendar[row][col].isBefore(minDate, "day")) classes.push("off", "disabled")

    //don't allow selection of dates after the maximum date
    if (maxDate && calendar[row][col].isAfter(maxDate, "day")) classes.push("off", "disabled")

    //don't allow selection of date if a custom function decides it's invalid
    if (isInvalidDate(calendar[row][col])) classes.push("off", "disabled")

    //highlight the currently selected start date
    if (calendar[row][col].format("YYYY-MM-DD") === startDate?.format("YYYY-MM-DD")) {
        classes.push("active", "start-date")

        if (startDate !== null && endDate !== null) {
            classes.push("exist-range")
        }
    }

    //highlight the currently selected end date
    if (endDate !== null && calendar[row][col].format("YYYY-MM-DD") === endDate?.format("YYYY-MM-DD")) {
        classes.push("active", "end-date")

        if (startDate !== null && endDate !== null) {
            classes.push("exist-range")
        }
    }

    //highlight dates in-between the selected dates
    if (endDate !== null && calendar[row][col] > startDate && calendar[row][col] < endDate) classes.push("in-range")

    //apply custom classes for this date
    let isCustom = isCustomDate(calendar[row][col])

    if (isCustom !== false) {
        if (typeof isCustom === "string") classes.push(isCustom)
        else Array.prototype.push.apply(classes, isCustom)
    }

    let cname = "",
        disabled = false,
        offDate = false
    for (let i = 0; i < classes.length; i++) {
        cname += classes[i] + " "
        if (classes[i] === "disabled") disabled = true
        if (classes[i] === "off") offDate = true
    }
    if (!disabled) cname += "available"

    return (
        <td
            className={cname.replace(/^\s+|\s+$/g, "")}
            data-title={`r${row}c${col}`}
            data-date={calendar[row][col].format("DD/MM/YYYY")}
            onClick={(e) => (!disabled && !offDate ? props.onClick(e, side, row, col) : undefined)}
        >
            {calendar[row][col].date()}
        </td>
    )
}

DaysInMonth.defaultProps = {
    minDate: null,
    maxDate: null,
    isInvalidDate: () => {},
    isCustomDate: () => {},
    onClick: () => {},
}
