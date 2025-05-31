"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import PartsGuessLogo from "./parts-guess-logo"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.3, ease: "easeIn" },
  },
}

const optionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
}

// Game data - automotive parts for PartsGuess MVP
const gameData = [
  {
    id: 1,
    image: "/parts-images/engine_oil_filter.jpg",
    correctAnswer: "Engine Oil Filter",
    options: ["Engine Oil Filter", "Fuel Filter", "Air Filter", "Transmission Filter"],
    description: "Removes contaminants from engine oil to keep the engine running smoothly and extend its life.",
  },
  {
    id: 2,
    image: "/parts-images/disc_brake_pad_set.jpg",
    correctAnswer: "Disc Brake Pad Set",
    options: ["Disc Brake Pad Set", "Drum Brake Shoes", "Brake Rotors", "Brake Calipers"],
    description: "Friction material that presses against brake rotors to slow down or stop the vehicle.",
  },
  {
    id: 3,
    image: "/parts-images/disc_brake_rotor.jpg",
    correctAnswer: "Disc Brake Rotor",
    options: ["Disc Brake Rotor", "Brake Drum", "Flywheel", "Clutch Disc"],
    description: "Metal disc that brake pads clamp down on to create friction and stop the vehicle.",
  },
  {
    id: 4,
    image: "/parts-images/air_filter.jpg",
    correctAnswer: "Air Filter",
    options: ["Air Filter", "Cabin Air Filter", "Oil Filter", "Fuel Filter"],
    description: "Filters air entering the engine to prevent dirt and debris from causing damage.",
  },
  {
    id: 5,
    image: "/parts-images/spark_plug.jpg",
    correctAnswer: "Spark Plug",
    options: ["Spark Plug", "Glow Plug", "Ignition Coil", "Fuel Injector"],
    description: "Ignites the air-fuel mixture in the engine's combustion chamber to power the vehicle.",
  },
  {
    id: 6,
    image: "/parts-images/cabin_air_filter.jpg",
    correctAnswer: "Cabin Air Filter",
    options: ["Cabin Air Filter", "Engine Air Filter", "HVAC Filter", "Oil Filter"],
    description: "Filters air entering the passenger compartment through the HVAC system.",
  },
  {
    id: 7,
    image: "/parts-images/serpentine_belt.jpg",
    correctAnswer: "Serpentine Belt",
    options: ["Serpentine Belt", "Timing Belt", "V-Belt", "Drive Chain"],
    description: "Single belt that drives multiple engine accessories like the alternator, power steering, and A/C.",
  },
  {
    id: 8,
    image: "/parts-images/vehicle_battery.jpg",
    correctAnswer: "Vehicle Battery",
    options: ["Vehicle Battery", "Alternator", "Starter Motor", "Capacitor"],
    description: "Provides electrical power to start the engine and run electrical systems when the engine is off.",
  },
  {
    id: 9,
    image: "/parts-images/wiper_blade.jpg",
    correctAnswer: "Wiper Blade",
    options: ["Wiper Blade", "Wiper Motor", "Wiper Arm", "Windshield Washer Pump"],
    description: "Rubber blade that clears water and debris from the windshield for clear visibility.",
  },
  {
    id: 10,
    image: "/parts-images/suspension_shock_absorber.jpg",
    correctAnswer: "Suspension Shock Absorber",
    options: ["Suspension Shock Absorber", "Coil Spring", "Strut Mount", "Sway Bar"],
    description: "Dampens suspension movement to provide a smooth ride and maintain tire contact with the road.",
  },
  {
    id: 11,
    image: "/parts-images/automatic_transmission_fluid.jpg",
    correctAnswer: "Automatic Transmission Fluid",
    options: ["Automatic Transmission Fluid", "Engine Oil", "Power Steering Fluid", "Brake Fluid"],
    description: "Lubricates and cools automatic transmission components while enabling gear changes.",
  },
  {
    id: 12,
    image: "/parts-images/disc_brake_caliper.jpg",
    correctAnswer: "Disc Brake Caliper",
    options: ["Disc Brake Caliper", "Brake Master Cylinder", "Brake Booster", "ABS Module"],
    description: "Houses brake pads and uses hydraulic pressure to squeeze them against the brake rotor.",
  },
  {
    id: 13,
    image: "/parts-images/engine_oil.jpg",
    correctAnswer: "Engine Oil",
    options: ["Engine Oil", "Transmission Fluid", "Coolant", "Power Steering Fluid"],
    description: "Lubricates engine components, reduces friction, and helps regulate engine temperature.",
  },
  {
    id: 14,
    image: "/parts-images/suspension_stabilizer_bar_link.jpg",
    correctAnswer: "Suspension Stabilizer Bar Link",
    options: ["Suspension Stabilizer Bar Link", "Tie Rod End", "Ball Joint", "Control Arm Bushing"],
    description: "Connects the stabilizer bar to the suspension to reduce body roll during cornering.",
  },
  {
    id: 15,
    image: "/parts-images/suspension_strut_and_coil_spring_assembly.jpg",
    correctAnswer: "Suspension Strut and Coil Spring Assembly",
    options: ["Suspension Strut and Coil Spring Assembly", "Shock Absorber", "Leaf Spring", "Torsion Bar"],
    description: "Complete suspension unit that supports vehicle weight and absorbs road impacts.",
  },
  {
    id: 16,
    image: "/parts-images/engine_coolant__antifreeze.jpg",
    correctAnswer: "Engine Coolant / Antifreeze",
    options: ["Engine Coolant / Antifreeze", "Engine Oil", "Transmission Fluid", "Windshield Washer Fluid"],
    description: "Liquid that circulates through the engine to regulate temperature and prevent freezing.",
  },
  {
    id: 17,
    image: "/parts-images/suspension_control_arm.jpg",
    correctAnswer: "Suspension Control Arm",
    options: ["Suspension Control Arm", "Tie Rod", "Sway Bar", "Strut Assembly"],
    description: "Connects the wheel hub to the vehicle frame and allows controlled wheel movement.",
  },
  {
    id: 18,
    image: "/parts-images/cv_axle_assembly.jpg",
    correctAnswer: "CV Axle Assembly",
    options: ["CV Axle Assembly", "Drive Shaft", "Axle Shaft", "Universal Joint"],
    description: "Transfers power from the transmission to the wheels while allowing for steering and suspension movement.",
  },
  {
    id: 19,
    image: "/parts-images/wheel_bearing_and_hub_assembly.jpg",
    correctAnswer: "Wheel Bearing and Hub Assembly",
    options: ["Wheel Bearing and Hub Assembly", "Brake Hub", "Wheel Stud", "Lug Nut"],
    description: "Allows wheels to rotate smoothly while supporting the vehicle's weight.",
  },
  {
    id: 20,
    image: "/parts-images/engine_valve_cover_gasket_set.jpg",
    correctAnswer: "Engine Valve Cover Gasket Set",
    options: ["Engine Valve Cover Gasket Set", "Head Gasket", "Oil Pan Gasket", "Intake Manifold Gasket"],
    description: "Seals the valve cover to prevent oil leaks from the top of the engine.",
  },
]

export default function PartsGuessGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [gameState, setGameState] = useState<"welcome" | "playing" | "feedback" | "finished">("welcome")
  const [timeLeft, setTimeLeft] = useState(15)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = gameData[currentQuestionIndex]

  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState("feedback")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  const handleStartGame = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentQuestionIndex(0)
      setScore(0)
      setSelectedAnswer(null)
      setGameState("playing")
      setTimeLeft(15)
      setIsTransitioning(false)
    }, 300)
  }

  const handleAnswerSelect = (answer: string) => {
    if (gameState !== "playing") return

    setSelectedAnswer(answer)

    // Update score immediately if correct
    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }

    // Change state without animation
    setGameState("feedback")
  }

  const handleNextQuestion = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < gameData.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
        setSelectedAnswer(null)
        setGameState("playing")
        setTimeLeft(15)
      } else {
        setGameState("finished")
      }
      setIsTransitioning(false)
    }, 300)
  }

  const handleRestart = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setGameState("welcome")
      setIsTransitioning(false)
    }, 300)
  }

  if (gameState === "welcome") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="welcome"
          className="flex flex-col items-center justify-center min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="text-center">
            <motion.div className="flex flex-col items-center justify-center mb-8" variants={itemVariants}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <PartsGuessLogo width={160} height={160} />
              </motion.div>
            </motion.div>
            <motion.p className="text-xl mb-8 text-slate-300 font-light tracking-wide" variants={itemVariants}>
              Test your knowledge of automotive parts!
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleStartGame}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium tracking-wide text-lg px-8 py-6"
                disabled={isTransitioning}
              >
                Start Game
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  if (gameState === "finished") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="finished"
          className="flex flex-col items-center justify-center min-h-[80vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={cardVariants}>
            <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-xl">
              <CardContent className="pt-8 pb-6 px-6">
                <motion.div className="flex justify-center mb-4" variants={itemVariants}>
                  <PartsGuessLogo width={120} height={120} />
                </motion.div>
                <motion.h2
                  className="text-4xl font-bold text-center mb-6 text-slate-100 tracking-tight"
                  variants={itemVariants}
                >
                  Game Over!
                </motion.h2>
                <motion.p className="text-xl text-center mb-5 text-slate-200" variants={itemVariants}>
                  Your final score: <span className="font-bold text-orange-500">{score}</span>{" "}
                  <span className="text-slate-300">out of {gameData.length}</span>
                </motion.p>
                <motion.div className="mb-6" variants={itemVariants}>
                  <Progress value={(score / gameData.length) * 100} className="h-3 bg-slate-700" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  {score === gameData.length ? (
                    <p className="text-green-400 text-center mb-6 text-lg font-medium">
                      Perfect score! You're a car parts expert!
                    </p>
                  ) : score >= gameData.length / 2 ? (
                    <p className="text-orange-400 text-center mb-6 text-lg font-medium">
                      Good job! You know your automotive parts!
                    </p>
                  ) : (
                    <p className="text-slate-300 text-center mb-6 text-lg font-medium">
                      Keep learning about automotive parts!
                    </p>
                  )}
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button
                    onClick={handleRestart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium tracking-wide py-5 text-lg"
                    disabled={isTransitioning}
                  >
                    Play Again
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div
      key={`playing-${currentQuestionIndex}`}
      className="flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="w-full max-w-4xl">
        <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
          <div className="flex items-center">
            <PartsGuessLogo width={40} height={40} showText={false} className="mr-2" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Parts<span className="text-orange-500">Guess</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="text-lg px-4 py-1.5 bg-slate-800 border-2 border-blue-500 text-slate-100 rounded-full font-medium">
              Score: {score}/{gameData.length}
            </Badge>
            <Badge
              className={`text-lg px-4 py-1.5 bg-slate-800 border-2 rounded-full font-medium ${
                timeLeft < 5 ? "border-red-500 text-red-400" : "border-orange-500 text-orange-400"
              }`}
            >
              Time: {timeLeft}s
            </Badge>
          </div>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-slate-800 border-slate-700 shadow-xl mb-6">
            <CardContent className="p-6">
              <motion.div className="mb-4" variants={itemVariants}>
                <p className="text-sm text-slate-400 mb-1 font-medium tracking-wide">
                  Question {currentQuestionIndex + 1} of {gameData.length}
                </p>
                <Progress value={((currentQuestionIndex + 1) / gameData.length) * 100} className="h-2 bg-slate-700" />
              </motion.div>

              <motion.div
                className="relative w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden border border-slate-600"
                variants={itemVariants}
              >
                <Image
                  src={currentQuestion.image || "/placeholder.svg"}
                  alt="Car part"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>

              <motion.h2
                className="text-2xl font-semibold mb-6 text-slate-100 border-l-4 border-orange-500 pl-3 tracking-tight"
                variants={itemVariants}
              >
                What automotive part is this?
              </motion.h2>

              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={itemVariants}>
                {currentQuestion.options.map((option, index) => (
                  <motion.div key={option} custom={index} variants={optionVariants} initial="hidden" animate="visible">
                    <Button
                      onClick={() => handleAnswerSelect(option)}
                      disabled={gameState === "feedback" || isTransitioning}
                      variant="outline"
                      className={`h-auto py-4 px-5 justify-start text-left border-2 w-full ${
                        gameState === "feedback" && option === currentQuestion.correctAnswer
                          ? "bg-green-900/30 text-green-400 border-green-500 font-medium"
                          : gameState === "feedback" &&
                              selectedAnswer === option &&
                              option !== currentQuestion.correctAnswer
                            ? "bg-red-900/30 text-red-400 border-red-500 font-medium"
                            : "bg-slate-800 text-slate-100 border-slate-600 hover:bg-slate-700 hover:border-orange-500 hover:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            gameState === "feedback" && option === currentQuestion.correctAnswer
                              ? "bg-green-500 text-slate-900"
                              : gameState === "feedback" &&
                                  selectedAnswer === option &&
                                  option !== currentQuestion.correctAnswer
                                ? "bg-red-500 text-slate-900"
                                : "bg-slate-700 text-slate-300 border border-slate-500"
                          }`}
                        >
                          {gameState === "feedback" && option === currentQuestion.correctAnswer
                            ? "✓"
                            : gameState === "feedback" &&
                                selectedAnswer === option &&
                                option !== currentQuestion.correctAnswer
                              ? "✗"
                              : ""}
                        </div>
                        <span className="text-base font-medium tracking-wide">{option}</span>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>

              {gameState === "feedback" && (
                <div className="mt-6 p-5 rounded-lg bg-slate-700 border-2 border-slate-600">
                  <h3 className="font-semibold text-lg mb-2 flex items-center">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <>
                        <div className="w-6 h-6 rounded-full bg-green-500 text-slate-900 flex items-center justify-center mr-2">
                          ✓
                        </div>
                        <span className="text-green-400 tracking-wide">Correct!</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 rounded-full bg-red-500 text-slate-900 flex items-center justify-center mr-2">
                          ✗
                        </div>
                        <span className="text-red-400 tracking-wide">Incorrect!</span>
                      </>
                    )}
                  </h3>
                  <p className="text-slate-300 ml-8 font-light leading-relaxed">{currentQuestion.description}</p>
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center py-3 text-base font-medium tracking-wide"
                    disabled={isTransitioning}
                  >
                    {currentQuestionIndex < gameData.length - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      "See Results"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
