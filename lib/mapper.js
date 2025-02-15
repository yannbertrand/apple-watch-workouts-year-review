module.exports = {
  mapWorkoutAttributes: ({
    workoutActivityType,
    duration,
    sourceName,
    sourceVersion,
    creationDate,
    startDate,
    endDate,
  }) => {
    return {
      id: `${startDate}${endDate}${workoutActivityType}${duration}`,
      type: getWorkoutType(workoutActivityType),
      duration: Number.parseFloat(duration),
      sourceName,
      sourceVersion,
      creationDate: getIsoDate(creationDate),
      startDate: getIsoDate(startDate),
      endDate: getIsoDate(endDate),
    }
  },

  mapWorkoutStatisticsAttributes: (workout, { type, sum, unit }) => {
    switch (type) {
      case 'HKQuantityTypeIdentifierActiveEnergyBurned':
        return { ...workout, totalEnergyBurned: Number.parseFloat(sum) }
      case 'HKQuantityTypeIdentifierDistanceCycling':
      case 'HKQuantityTypeIdentifierDistanceSwimming':
      case 'HKQuantityTypeIdentifierDistanceWalkingRunning':
        return { ...workout, totalDistance: getIsoDistance(Number.parseFloat(sum), unit) }
    }

    return workout
  },
}

const workoutsTypes = {
  HKWorkoutActivityTypeAmericanFootball: 'american-football',
  HKWorkoutActivityTypeArchery: 'archery',
  HKWorkoutActivityTypeAustralianFootball: 'australian-football',
  HKWorkoutActivityTypeBadminton: 'badminton',
  HKWorkoutActivityTypeBarre: 'barre',
  HKWorkoutActivityTypeBaseball: 'baseball',
  HKWorkoutActivityTypeBasketball: 'basketball',
  HKWorkoutActivityTypeBowling: 'bowling',
  HKWorkoutActivityTypeBoxing: 'boxing',
  HKWorkoutActivityTypeClimbing: 'climbing',
  HKWorkoutActivityTypeCooldown: 'cooldown',
  HKWorkoutActivityTypeCoreTraining: 'core',
  HKWorkoutActivityTypeCricket: 'cricket',
  HKWorkoutActivityTypeCrossCountrySkiing: 'cross-country-skiing',
  HKWorkoutActivityTypeCrossTraining: 'cross',
  HKWorkoutActivityTypeCurling: 'curling',
  HKWorkoutActivityTypeCycling: 'cycling',
  HKWorkoutActivityTypeDance: 'dance',
  HKWorkoutActivityTypeDanceInspiredTraining: 'dance',
  HKWorkoutActivityTypeDiscSports: 'disk',
  HKWorkoutActivityTypeDownhillSkiing: 'downhill-skiing',
  HKWorkoutActivityTypeElliptical: 'elliptical',
  HKWorkoutActivityTypeEquestrianSports: 'horse',
  HKWorkoutActivityTypeFencing: 'fencing',
  HKWorkoutActivityTypeFishing: 'fishing',
  HKWorkoutActivityTypeFitnessGaming: 'fitness-gaming',
  HKWorkoutActivityTypeFlexibility: 'flexibility',
  HKWorkoutActivityTypeFunctionalStrengthTraining: 'strength',
  HKWorkoutActivityTypeGolf: 'golf',
  HKWorkoutActivityTypeGymnastics: 'gymnastics',
  HKWorkoutActivityTypeHandball: 'handball',
  HKWorkoutActivityTypeHandCycling: 'hand-cycling',
  HKWorkoutActivityTypeHighIntensityIntervalTraining: 'hiit',
  HKWorkoutActivityTypeHiking: 'hiking',
  HKWorkoutActivityTypeHockey: 'hockey',
  HKWorkoutActivityTypeHunting: 'hunting',
  HKWorkoutActivityTypeJumpRope: 'jump-rope',
  HKWorkoutActivityTypeKickboxing: 'kickboxing',
  HKWorkoutActivityTypeLacrosse: 'lacrosse',
  HKWorkoutActivityTypeMartialArts: 'martial-arts',
  HKWorkoutActivityTypeMindAndBody: 'mind-and-body',
  HKWorkoutActivityTypeMixedCardio: 'cardio',
  HKWorkoutActivityTypeMixedMetabolicCardioTraining: 'cardio',
  HKWorkoutActivityTypePaddleSports: 'kayaking',
  HKWorkoutActivityTypePilates: 'pilates',
  HKWorkoutActivityTypePlay: 'play',
  HKWorkoutActivityTypePreparationAndRecovery: 'therapeutic',
  HKWorkoutActivityTypeRacquetball: 'racquetball',
  HKWorkoutActivityTypeRowing: 'rowing',
  HKWorkoutActivityTypeRugby: 'rugby',
  HKWorkoutActivityTypeRunning: 'running',
  HKWorkoutActivityTypeSailing: 'sailing',
  HKWorkoutActivityTypeSkatingSports: 'skating',
  HKWorkoutActivityTypeSnowSports: 'snow',
  HKWorkoutActivityTypeSoccer: 'soccer',
  HKWorkoutActivityTypeSoftball: 'softball',
  HKWorkoutActivityTypeSquash: 'squash',
  HKWorkoutActivityTypeSnowboarding: 'snowboarding',
  HKWorkoutActivityTypeStairClimbing: 'stair-climbing',
  HKWorkoutActivityTypeStairs: 'stairs',
  HKWorkoutActivityTypeStepTraining: 'step-training',
  HKWorkoutActivityTypeSurfingSports: 'surfing',
  HKWorkoutActivityTypeSwimBikeRun: 'triathlon',
  HKWorkoutActivityTypeSwimming: 'swimming',
  HKWorkoutActivityTypeTableTennis: 'table-tennis',
  HKWorkoutActivityTypeTaiChi: 'tai-chi',
  HKWorkoutActivityTypeTennis: 'tennis',
  HKWorkoutActivityTypeTrackAndField: 'track-and-field',
  HKWorkoutActivityTypeTraditionalStrengthTraining: 'strength',
  HKWorkoutActivityTypeVolleyball: 'volleyball',
  HKWorkoutActivityTypeWalking: 'walking',
  HKWorkoutActivityTypeWaterFitness: 'water-fitness',
  HKWorkoutActivityTypeWaterPolo: 'water-polo',
  HKWorkoutActivityTypeWaterSports: 'water',
  HKWorkoutActivityTypeWheelchairWalkPace: 'wheelchair-walk-pace',
  HKWorkoutActivityTypeWheelchairRunPace: 'wheelchair-run-pace',
  HKWorkoutActivityTypeWrestling: 'wrestling',
  HKWorkoutActivityTypeYoga: 'yoga',
  HKWorkoutActivityTypeOther: 'other',
}

const getWorkoutType = (workoutActivityType) => {
  const type = workoutsTypes[workoutActivityType]

  if (type === undefined) {
    throw new Error(`${workoutActivityType} workoutActivityType not handled yet`)
  }

  return type
}

const getIsoDate = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString()
}

const getIsoDistance = (distance, unit) => {
  switch (unit) {
    case 'km':
      return distance
    case 'm':
      return distance / 1000
    default:
      throw new Error(`${unit} unit not handled yet`)
  }
}
