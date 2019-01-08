export class DateRange {
  start: Date;
  end: Date;
 
  constructor(start: Date | number | string, end: Date | number | string) {
    this.start = parseDateTime(start);
    this.end = parseDateTime(end);
  }

  /**
   * 
   * dateRangeA: ---|-----------|---------
   * dateRangeB: ------|-----------|------
   * dateRangeC: --------|--------|-------
   * result    : --------|======|---------
   */
  static intersection(dateRangeA: DateRange, dateRangeB: DateRange): DateRange {
    if (!dateRangeA.isOverlap(dateRangeB)) {
      return null;
    }

    const start = dateRangeA.start.getTime() >= dateRangeB.start.getTime() ? dateRangeA.start : dateRangeB.start;
    const end = dateRangeA.end.getTime() <= dateRangeB.end.getTime() ? dateRangeA.end : dateRangeB.end;

    return new DateRange(start, end);
  }

  static merge(dateRanges: DateRange[]): DateRange[] {
    if(dateRanges.length === 0) {
      return []
    }

    // Create an empty stack
    const result = [];

    // Sort ranges by start
    const ranges = dateRanges.slice().sort((a, b) => a.start.getTime() - b.start.getTime())

    ranges.forEach(range => {
      if (result.length === 0 || result[result.length - 1].end < range.start) {
        result.push(range)
      }
      else {
        result[result.length - 1] = new DateRange(
          result[result.length - 1].start,
          result[result.length - 1].end > range.end ? result[result.length - 1].end : range.end
        )
      }
    })

    return result;
  }


  isOverlap(dateRange: DateRange): boolean {
    if (this.start <= dateRange.start && dateRange.start < this.end) {
      return true
    }
    
    if (this.start < dateRange.end && dateRange.end <= this.end) {
      return true
    }

    if (dateRange.start <= this.start && this.end <= dateRange.end) {
      return true
    }

    return false;
  }


  clone(): DateRange {
    return new DateRange(this.start.getTime(), this.end.getTime())
  }

  exclude(dateRange: DateRange | DateRange[]): DateRange[] {
    if (Array.isArray(dateRange)) {
      let result = [this.clone()]

      dateRange.forEach(v => {
        let tmp = [];

        result.forEach(r => {
          tmp = tmp.concat(r.exclude(v))
        })

        result = tmp;
      })

      return result;
    }

    if (!this.isOverlap(dateRange)) {
      return [this.clone()]
    }

    if (this.start < dateRange.start && dateRange.end < this.end) {
      return [
        new DateRange(this.start, dateRange.start),
        new DateRange(dateRange.end, this.end)
      ]
    }

    if (dateRange.start <= this.start && this.end <= dateRange.end) {
      return []
    }

    if (dateRange.start <= this.start && dateRange.end < this.end) {
      return [
        new DateRange(dateRange.end, this.end)
      ]
    }

    if (this.start < dateRange.start && this.end <= dateRange.end) {
      return [
        new DateRange(this.start, dateRange.start)
      ]
    }

    return []
  }


  /**
   * ---|---------|-------
   * ---|---|-------------
   * -------|---|---------
   * -----------|-|-------
   * 
   * @param period in ms
   * @param options 
   */
  split(period: number, options: { round?: boolean } = null): Date[] {
    const periods = []
    const round = options != null && options.round
    let current = new Date(this.start.getTime());

    while(round ? current <= this.end : current < this.end) {
      periods.push(current)
      current = new Date(current.getTime())
      current.setMilliseconds(period)
    }

    if (!round && current !== this.end) {
      periods.push(new Date(this.end.getTime()))
    }

    return periods;
  }
}

function parseDateTime(dateTime: any): Date {
  if (dateTime instanceof Date) {
    return dateTime
  }

  if (typeof dateTime === 'string' || typeof dateTime === 'number') {
    return new Date(dateTime)
  }
  
  return null;
}