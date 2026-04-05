export interface StarResCheck {
  1: staritem
  2: staritem
  3: staritem
  4: staritem
  5: staritem
}

export interface staritem {
  icon: string
  color: string
}

export function CheckStars(star: number): StarResCheck {
  return {
    1: CheckStar(star >= 1),
    2: CheckStar(star >= 2),
    3: CheckStar(star >= 3),
    4: CheckStar(star >= 4),
    5: CheckStar(star >= 5),
  }
}

export function CheckStar(star: boolean): staritem {
  if (star) {
    return {
      icon: 'tabler-star-filled',
      color: 'warning',
    }
  }
  else {
    return {
      icon: 'tabler-star',
      color: 'secondary',
    }
  }
}
