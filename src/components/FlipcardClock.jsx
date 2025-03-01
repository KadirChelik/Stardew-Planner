import styled from "styled-components";
import { useState, useEffect } from 'react'
import { animated, useSpring, config } from 'react-spring'
import PropTypes from 'prop-types'

export default function Flipcard({ measure, time }) {
  const [displayedNumber, setDisplayedNumber] = useState(time)
  const [previousNumber, setPreviousNumber] = useState()
  const [cancelAnimation, setCancelAnimation] = useState(false)

  useEffect(() => {
    if (time === displayedNumber) {
      setCancelAnimation(false)
      setPreviousNumber(time)
    } else {
      setCancelAnimation(true)
      setDisplayedNumber(time)
    }
  }, [displayedNumber, time])

  useEffect(() => {
    setTimeout(setPreviousNumber(displayedNumber), 700)
  }, [displayedNumber])

  const frontCardAnimation = useSpring({
    from: { transform: 'rotateX(0deg)' },
    to: { transform: 'rotateX(-180deg)' },
    delay: 0,
    config: config.slow,
    reset: cancelAnimation,
  })
  const backCardAnimation = useSpring({
    from: { transform: 'rotateX(180deg)' },
    to: { transform: 'rotateX(0deg)' },
    delay: 0,
    config: config.slow,
    reset: cancelAnimation,
  })

  const formattedNewNumber = formatNumber(displayedNumber)
  const formattedPreviousNumber = formatNumber(previousNumber)

  return (
    <div className="flipcard-flex-container">
    <div className="flipcard-container">
      <div className="flipcard-static-top">
        <span>{formattedNewNumber}</span>
      </div>

      <div className="flipcard-static-bottom">
        <span>{formattedPreviousNumber}</span>
      </div>

      <animated.div className="flipcard-animated-front" style={frontCardAnimation}>
        <span>{formattedPreviousNumber}</span>
      </animated.div>

      <animated.div className="flipcard-animated-back" style={backCardAnimation}>
        <span>{formattedNewNumber}</span>
      </animated.div>

      <div className="flipcard-coil-left"></div>
      <div className="flipcard-coil-right"></div>
    </div>
    
    <div className="flipcard-subtext">{measure}</div>
    </div>
  )
  function formatNumber(number = 0) {
    let formattedNumber = number.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
    return formattedNumber
  }
}
Flipcard.propTypes = {
  measure: PropTypes.string,
  time: PropTypes.number,
}
