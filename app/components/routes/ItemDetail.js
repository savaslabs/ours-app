import React, { useState, useEffect } from 'react'

// React-Date.
import { DayPickerRangeController } from 'react-dates'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet'
import aphroditeInterface from 'react-with-styles-interface-aphrodite'
import DefaultTheme from 'react-dates/lib/theme/DefaultTheme'
ThemedStyleSheet.registerInterface(aphroditeInterface)
ThemedStyleSheet.registerTheme(DefaultTheme)

function ItemDetail(props) {
  // Date picker.
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [focusedInput, setFocusedInput] = useState('startDate')

  return (
    <main>
      <h1>Item #{props.match.params.itemId}</h1>
      <DayPickerRangeController
        startDate={startDate}
        endDate={endDate}
        onDatesChange={({ startDate, endDate }) => {
          setStartDate(startDate)
          setEndDate(endDate)
        }}
        focusedInput={focusedInput}
        onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
      />
    </main>
  )
}

export default ItemDetail
