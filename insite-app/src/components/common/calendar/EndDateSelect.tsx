import { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducer";
import { ItemType } from "@customtypes/dataTypes";
import DropDown from "../dropdown/DropDown";

interface EndDateSelectProps {
  onChange: (item: string) => void;
  openDropEndYear: boolean;
  closeDropEndYear: () => void;
  toggleDropEndYear: () => void;
  openDropEndMonth: boolean;
  closeDropEndMonth: () => void;
  toggleDropEndMonth: () => void;
  openDropEndDay: boolean;
  closeDropEndDay: () => void;
  toggleDropEndDay: () => void;
}

const EndDateSelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  width: 100%;
  height: 100%;
  font-size: 1.2rem;
`;
function EndDateSelect({
  onChange,
  openDropEndYear,
  openDropEndMonth,
  openDropEndDay,
  closeDropEndYear,
  closeDropEndMonth,
  closeDropEndDay,
  toggleDropEndYear,
  toggleDropEndMonth,
  toggleDropEndDay,
}: EndDateSelectProps) {
  const dispatch = useDispatch();

  const startDate = useSelector(
    (state: RootState) => state.DateSelectionInfo.start,
  );
  const pastDate = useSelector(
    (state: RootState) => state.DateSelectionInfo.past,
  );
  const latestDate = useSelector(
    (state: RootState) => state.DateSelectionInfo.latest,
  );
  const endDate = useSelector(
    (state: RootState) => state.DateSelectionInfo.end,
  );

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const parseString = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map((val, index) => {
      if (index === 0) return val;
      return String(parseInt(val, 10));
    });
    return [year, month, day];
  };

  const [endYear, setEndYear] = useState(parseString(endDate)[0]);
  const [endMonth, setEndMonth] = useState(parseString(endDate)[1]);
  const [endDay, setEndDay] = useState(parseString(endDate)[2]);

  const parseDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // 월은 0에서 시작합니다.
  };

  const startDateObj = startDate ? parseDate(startDate) : parseDate(pastDate);
  const latestDateObj = parseDate(latestDate);

  const getYearsInRange = (start: Date, latest: Date) => {
    const years = [];
    for (
      let year = start.getFullYear();
      year <= latest.getFullYear();
      year += 1
    ) {
      years.push(year.toString());
    }
    return years;
  };

  const getMonthsInRange = (start: Date, latest: Date) => {
    const months = [];
    // 시작과 종료가 같은 년도일 때만
    if (start.getFullYear() === latest.getFullYear()) {
      for (
        let month = start.getMonth();
        month <= latest.getMonth();
        month += 1
      ) {
        months.push((month + 1).toString()); // 실제 월은 1에서 시작합니다.
      }
    } else {
      // 전체 12개월
      for (let month = 1; month <= 12; month += 1) {
        months.push(month.toString());
      }
    }
    return months;
  };

  const yearArray = getYearsInRange(startDateObj, latestDateObj);
  const monthArray = getMonthsInRange(startDateObj, latestDateObj);
  const [dayOptions, setDayOptions] = useState<ItemType[]>([]);

  useEffect(() => {
    const getDaysInRange = (year: number, month: number) => {
      const days = [];
      let lastDayOfMonth;

      if (month === 2) {
        lastDayOfMonth = isLeapYear(year) ? 29 : 28;
      } else if (month === 4 || month === 6 || month === 9 || month === 11) {
        lastDayOfMonth = 30;
      } else {
        lastDayOfMonth = 31;
      }

      for (let day = 1; day <= lastDayOfMonth; day += 1) {
        days.push(day.toString());
      }

      return days;
    };

    const newDayOptions = getDaysInRange(
      parseInt(endYear, 10),
      parseInt(endMonth, 10),
    );
    setDayOptions(
      newDayOptions.map((day, index) => {
        return { id: index, name: day };
      }),
    );
  }, [endYear, endMonth]);

  const yearOptions: ItemType[] = yearArray.map((year, index) => {
    return { id: index, name: year };
  });
  const monthOptions: ItemType[] = monthArray.map((month, index) => {
    return { id: index, name: month };
  });

  const handleEndYear = (item: ItemType) => {
    setEndYear(item.name);
  };
  const handleEndMonth = (item: ItemType) => {
    setEndMonth(item.name);
  };
  const handleEndDay = (item: ItemType) => {
    setEndDay(item.name);
  };

  useEffect(() => {
    const newEndDate: string = `${endYear}-${endMonth}-${endDay}`;

    onChange(newEndDate);
  }, [endYear, endMonth, endDay, latestDate, dispatch, onChange]);

  return (
    <EndDateSelectContainer>
      <DropDown
        items={yearOptions}
        width="20%"
        height="3rem"
        initialValue={parseString(endDate)[0]}
        onChange={handleEndYear}
        openDropdown={openDropEndYear}
        close={closeDropEndYear}
        toggle={toggleDropEndYear}
      />
      년
      <DropDown
        items={monthOptions}
        width="20%"
        height="3rem"
        initialValue={parseString(endDate)[1]}
        onChange={handleEndMonth}
        openDropdown={openDropEndMonth}
        close={closeDropEndMonth}
        toggle={toggleDropEndMonth}
      />
      월
      <DropDown
        items={dayOptions}
        width="20%"
        height="3rem"
        initialValue={parseString(endDate)[2]}
        onChange={handleEndDay}
        openDropdown={openDropEndDay}
        close={closeDropEndDay}
        toggle={toggleDropEndDay}
      />
      일
    </EndDateSelectContainer>
  );
}

export default EndDateSelect;
