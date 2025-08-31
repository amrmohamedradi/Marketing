import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024
const XS_BREAKPOINT = 475

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsTablet(window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isTablet
}

export function useIsExtraSmall() {
  const [isXS, setIsXS] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${XS_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsXS(window.innerWidth < XS_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsXS(window.innerWidth < XS_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isXS
}

export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md')

  React.useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < XS_BREAKPOINT) {
        setScreenSize('xs')
      } else if (width < 640) {
        setScreenSize('sm')
      } else if (width < MOBILE_BREAKPOINT) {
        setScreenSize('md')
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize('lg')
      } else if (width < 1536) {
        setScreenSize('xl')
      } else {
        setScreenSize('2xl')
      }
    }

    const mql = window.matchMedia('(min-width: 1px)')
    mql.addEventListener('change', updateScreenSize)
    updateScreenSize()
    return () => mql.removeEventListener('change', updateScreenSize)
  }, [])

  return screenSize
}
