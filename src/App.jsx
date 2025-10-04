import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, Wand2, Edit, Save, Sparkles, Brain, Image, MessageSquare, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import './App.css'

function App() {
  const [userInput, setUserInput] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [targetTool, setTargetTool] = useState('chatgpt')
  const [promptStyle, setPromptStyle] = useState('creative')
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState('')
  const [saved, setSaved] = useState(false)

  const handleGenerate = async () => {
    if (!userInput.trim()) return

    setIsGenerating(true)
    setIsEditing(false)

    await new Promise(resolve => setTimeout(resolve, 1500))

    const mockPrompt = generateMockPrompt(userInput, targetTool, promptStyle)
    setGeneratedPrompt(mockPrompt)
    setEditedPrompt(mockPrompt)
    setIsGenerating(false)
  }

  const generateMockPrompt = (input, tool, style) => {
    const prompts = {
      chatgpt: {
        creative: `Act as a creative writing assistant. ${input}. Please provide a detailed, imaginative response that explores multiple perspectives and includes vivid descriptions. Use storytelling techniques to make your response engaging and memorable.`,
        factual: `Provide a comprehensive, factual analysis of: ${input}. Include relevant data, statistics, and credible sources. Structure your response with clear headings and bullet points for easy reading.`,
        detailed: `Please provide an in-depth, step-by-step explanation of: ${input}. Break down complex concepts into understandable parts, include examples, and explain the reasoning behind each step.`
      },
      dalle: {
        creative: `${input}, artistic style, vibrant colors, dynamic composition, high detail, professional photography lighting, 8K resolution, cinematic quality --ar 16:9`,
        factual: `${input}, photorealistic, accurate representation, natural lighting, documentary style, high resolution, precise details --ar 16:9`,
        detailed: `${input}, highly detailed, intricate design, professional quality, studio lighting, ultra-high resolution, perfect composition, masterpiece --ar 16:9`
      },
      midjourney: {
        creative: `${input} --style expressive --chaos 50 --ar 16:9 --v 6.1 --stylize 750 --quality 2`,
        factual: `${input} --style raw --ar 16:9 --v 6.1 --stylize 250 --quality 2`,
        detailed: `${input} --style raw --quality 2 --ar 16:9 --v 6.1 --stylize 500 --chaos 25 --seed 1234`
      }
    }

    return prompts[tool]?.[style] || `Generate content about: ${input}`
  }

  const handleCopy = async () => {
    const textToCopy = isEditing ? editedPrompt : generatedPrompt
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setEditedPrompt(generatedPrompt)
    } else {
      setGeneratedPrompt(editedPrompt)
    }
  }

  const handleSave = async () => {
    const promptToSave = isEditing ? editedPrompt : generatedPrompt

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('saved_prompts')
          .insert([
            {
              user_input: userInput,
              generated_prompt: promptToSave,
              target_tool: targetTool,
              prompt_style: promptStyle,
              created_at: new Date().toISOString()
            }
          ])
          .select()

        if (error) {
          console.error('Error saving prompt:', error)
        }
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving prompt:', error)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const getToolIcon = (tool) => {
    switch (tool) {
      case 'chatgpt': return <MessageSquare className="w-4 h-4" />
      case 'dalle': return <Image className="w-4 h-4" />
      case 'midjourney': return <Sparkles className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getToolColor = (tool) => {
    switch (tool) {
      case 'chatgpt': return 'from-emerald-500 to-teal-600'
      case 'dalle': return 'from-pink-500 to-rose-600'
      case 'midjourney': return 'from-violet-500 to-purple-600'
      default: return 'from-blue-500 to-cyan-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.7, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  AI Prompt Generator
                </h1>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent leading-tight">
                Transform Ideas into
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Perfect AI Prompts
                </span>
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            >
              Generate optimized prompts for ChatGPT, DALL-E, Midjourney, and more.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <span>What do you want to create?</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Describe your goal in plain language, and we'll craft the perfect prompt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Example: I want to create an image of a futuristic city with flying cars at sunset..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[140px] resize-none text-base border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target AI Tool</label>
                    <Select value={targetTool} onValueChange={setTargetTool}>
                      <SelectTrigger className="border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Select AI tool" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chatgpt">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>ChatGPT</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dalle">
                          <div className="flex items-center space-x-2">
                            <Image className="w-4 h-4 text-pink-600" />
                            <span>DALL-E</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="midjourney">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-violet-600" />
                            <span>Midjourney</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Prompt Style</label>
                    <Select value={promptStyle} onValueChange={setPromptStyle}>
                      <SelectTrigger className="border-slate-200 dark:border-slate-700">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="factual">Factual</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!userInput.trim() || isGenerating}
                  className={`w-full bg-gradient-to-r ${getToolColor(targetTool)} hover:shadow-lg hover:shadow-blue-500/25 text-white font-medium h-12 text-base transition-all duration-200`}
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Wand2 className="w-5 h-5" />
                      </motion.div>
                      Generating Magic...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence mode="wait">
            {generatedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <Card className="border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <CardTitle className="flex items-center space-x-2 text-2xl">
                        {getToolIcon(targetTool)}
                        <span>Generated Prompt</span>
                        <Badge className={`ml-2 bg-gradient-to-r ${getToolColor(targetTool)} border-0 text-white`}>
                          {targetTool.toUpperCase()}
                        </Badge>
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {isEditing ? 'Edit your prompt below' : 'Your optimized prompt is ready to use'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div
                      className="relative"
                      layout
                      transition={{ duration: 0.3 }}
                    >
                      <Textarea
                        value={isEditing ? editedPrompt : generatedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        readOnly={!isEditing}
                        className={`min-h-[140px] text-base resize-none transition-all duration-200 ${
                          isEditing
                            ? 'bg-white dark:bg-slate-800 border-blue-500 dark:border-blue-500'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                        }`}
                      />
                    </motion.div>

                    <div className="flex flex-wrap gap-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleCopy}
                          variant="outline"
                          className="flex items-center space-x-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleEdit}
                          variant="outline"
                          className={`flex items-center space-x-2 transition-all duration-200 ${
                            isEditing
                              ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Edit className="w-4 h-4" />
                          <span>{isEditing ? 'Done' : 'Edit'}</span>
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSave}
                          variant="outline"
                          className="flex items-center space-x-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                        >
                          {saved ? (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">Saved!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Save</span>
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: MessageSquare,
                title: 'Multiple AI Tools',
                description: 'Generate prompts optimized for ChatGPT, DALL-E, Midjourney, and more',
                color: 'from-emerald-500 to-teal-600'
              },
              {
                icon: Sparkles,
                title: 'Smart Optimization',
                description: 'AI-powered prompt enhancement for better results',
                color: 'from-violet-500 to-purple-600'
              },
              {
                icon: Save,
                title: 'Save & Organize',
                description: 'Keep your best prompts organized and easily accessible',
                color: 'from-blue-500 to-cyan-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="text-center p-6 border-slate-200/50 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl hover:bg-white/50 dark:hover:bg-slate-900/50 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600 dark:text-slate-400">
            <p className="text-sm">Built with React and Supabase</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
