export const cx = (...classes: Array<string | undefined | false | null>): string =>
  classes.filter(Boolean).join(' ')
