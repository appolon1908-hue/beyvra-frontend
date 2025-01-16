import React, { useEffect, useReducer, useState } from 'react';
import FormSelect from '../FormSelect';


interface dateSelectionProps {
    setFormData: any
    formData: any
}

const DateSelection: React.FC<dateSelectionProps> = ({setFormData, formData}) => {
    const fetchDate = formData?.dob
    const [year, month, day] = fetchDate?.split("-")
    console.log("year", year)
    const [daysArray, setDaysArray] = useState([]);
    const initialState = {
        days: 31,
        months: 12,
        startYear: 1900,
        endYear: 2024,
        monthValue: 0,
        yearValue: 1990,
        dayValue: 1,
        // daysArray: [],
        monthsArray: [],
        yearsArray: []
    };
    const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), initialState);

    console.log("state", state.dayValue)
    const{
        days,
        months,
        startYear,
        endYear,
        monthValue,
        yearValue,
        dayValue,
        // daysArray,
        monthsArray,
        yearsArray
    } = state;

    const formatInitialData = () => {
        const dayListing = [];
        const monthListing = [];
        const yearListing = [];
        let d = 1;
        while(d <= days){
            dayListing.push({value: d, label: `${d}`});
            ++d;
        }
        let m = 1;
        while(m <= months){
            monthListing.push({value: m, label: `${m}`});
            ++m;
        }
        let y = startYear;
        while(y <= endYear){
            yearListing.push({value: y, label: `${y}`});
            ++y;
        }
        setState({
            ...state,
            daysArray: dayListing,
            monthsArray: monthListing,
            yearsArray: yearListing
        });
        
    };

    const buildDays = (length: number) => {
       
        let daysArry: any = [];
        let d = 1;
        while(d <= 31){
            daysArry.push({value: d, label: `${d}`});
            ++d;
        }
        //shorten the length
        daysArry.length = ( daysArry.length - length );
        setDaysArray(daysArry);
    }

    //check leap year
    const checkLeapYear = (year: number) => {
        let v: any = (year / 4) * 1;
        //check if the result is an integer or a float using regExp
        if(/^[0-9]+$/.test(v)){
            (monthValue == 2) ?
                buildDays(2) //29 days
            : '';
        }else{
        (monthValue == 2) ?
            buildDays(3) //28 days
            : ''; 
        }
    }

    //check selected month
    const checkMonth = (month: string) => {
        let len = 0;
        //check month that has 30 days
        switch(month){
            //september
            case "9" :
                len = 1;
            break;
            //april
            case "4" :
                len = 1;
            break;
            //june
            case "6" :
                len = 1;
            break;
            //november
            case "11" :
                len = 1;
            break;
            default :
                len = 0;
            break; 
        }
        //check if february is selected
        if(month == '2'){
            checkLeapYear(yearValue);
        }else{
            buildDays(len);
        }
    }

    useEffect(()=> {
        formatInitialData();
    }, []);

    const handleMonthChange = (selectedMonth: string|number) => {

        if(selectedMonth !== monthValue){
            checkMonth(`${selectedMonth}`);
            setState({
                ...state,
                monthValue: selectedMonth
            });

            setFormData({
                ...formData,
                month: selectedMonth

            })
        }
    };

    const handleDayChange = (selectedDay: string|number) => {
        if(selectedDay){
            setState({
                ...state,
                dayValue: selectedDay
            })

            setFormData({
                ...formData,
                day: selectedDay
    
            })
        }

      
    };

    const handleYearChange = (selectedYear: string|number) => {
        if(selectedYear){
            checkLeapYear(Number(selectedYear));
            setState({
                ...state,
                yearValue: selectedYear
            })

            setFormData({
                ...formData,
                year: selectedYear
    
            })
            console.log("selected year", selectedYear )
        }
    };

    console.log("fuldate", day, month, year, monthsArray)

    return(
        <div className="flex flex-col md:flex-row gap-1 md:gap-4 justify-between">
            <div className="flex-grow">
                <FormSelect
                    data={monthsArray}
                    label="Month"
                    placeholder="Select month"
                    className="w-full"
                    id="month"
                    name="month"
                    selectedId={month}
                    onSelect={handleMonthChange}
                />
            </div>
            <div className="flex-grow">
                <FormSelect
                    data={daysArray}
                    label="Day"
                    placeholder="Select day"
                    className="w-full"
                    id="day"
                    name="day"
                    selectedId={day}
                    onSelect={handleDayChange}
                />
            </div>
            <div className="flex-grow">
                <FormSelect
                    data={yearsArray}
                    label="Year"
                    placeholder="Select year"
                    className="w-full"
                    selectedId={year}
                    id="year"
                    name="year"
                    onSelect={handleYearChange}
                />
            </div>
        </div>
    )
};

export default DateSelection;