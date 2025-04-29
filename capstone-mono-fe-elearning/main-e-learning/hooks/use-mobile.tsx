import * as React from "react"

const MOBILE_BREAKPOINT = 400

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isMobileWidth = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(isMobileDevice || isMobileWidth);
    };

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", checkIsMobile)
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      mql.removeEventListener("change", checkIsMobile)
      window.removeEventListener('resize', checkIsMobile);
    }
  }, [])

  return !!isMobile
}
