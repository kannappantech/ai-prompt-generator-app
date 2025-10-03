import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Copy, Wand2, Edit, Save, Sparkles, Brain, Image, MessageSquare, LogOut, User, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthModal } from './components/AuthModal'
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
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [user, setUser] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('https://xlhyimcdvjzk.manus.space/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.user)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    setIsAuthModalOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('https://xlhyimcdvjzk.manus.space/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleGenerate = async () => {
    if (!userInput.trim()) return
    
    setIsGenerating(true)
    
    try {
      const response = await fetch('https://xlhyimcdvjzk.manus.space/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput,
          target_tool: targetTool,
          prompt_style: promptStyle,
          user_id: user?.id
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setGeneratedPrompt(data.prompt.generated_prompt)
      } else {
        console.error('Error generating prompt:', data.error)
        // Fallback to mock prompt
        const mockPrompt = generateMockPrompt(userInput, targetTool, promptStyle)
        setGeneratedPrompt(mockPrompt)
      }
    } catch (error) {
      console.error('Network error:', error)
      // Fallback to mock prompt
      const mockPrompt = generateMockPrompt(userInput, targetTool, promptStyle)
      setGeneratedPrompt(mockPrompt)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockPrompt = (input, tool, style) => {
    const prompts = {
      chatgpt: {
        creative: `Act as a creative writing assistant. ${input}. Please provide a detailed, imaginative response that explores multiple perspectives and includes vivid descriptions. Use storytelling techniques to make your response engaging and memorable.`,
        factual: `Provide a comprehensive, factual analysis of: ${input}. Include relevant data, statistics, and credible sources. Structure your response with clear headings and bullet points for easy reading.`,
        detailed: `Please provide an in-depth, step-by-step explanation of: ${input}. Break down complex concepts into understandable parts, include examples, and explain the reasoning behind each step.`
      },
      dalle: {
        creative: `/imagine ${input}, artistic style, vibrant colors, dynamic composition, high detail, professional photography lighting, 8K resolution --ar 16:9 --v 6`,
        factual: `/imagine ${input}, photorealistic, accurate representation, natural lighting, documentary style, high resolution --ar 16:9 --v 6`,
        detailed: `/imagine ${input}, highly detailed, intricate design, professional quality, studio lighting, ultra-high resolution, perfect composition --ar 16:9 --v 6 --style raw`
      },
      midjourney: {
        creative: `${input} --style expressive --chaos 50 --ar 16:9 --v 6.1 --stylize 750`,
        factual: `${input} --style raw --ar 16:9 --v 6.1 --stylize 250`,
        detailed: `${input} --style raw --quality 2 --ar 16:9 --v 6.1 --stylize 500 --chaos 25`
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
    setIsEditing(true)
    setEditedPrompt(generatedPrompt)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedPrompt('')
  }

  const handleSaveEdit = () => {
    setGeneratedPrompt(editedPrompt)
    setIsEditing(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  const handleSavePrompt = async () => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }

    const promptToSave = isEditing ? editedPrompt : generatedPrompt

    try {
      const response = await fetch('https://xlhyimcdvjzk.manus.space/api/prompts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          original_input: userInput,
          generated_prompt: promptToSave,
          target_tool: targetTool,
          prompt_style: promptStyle
        })
      })

      const data = await response.json()

      if (data.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20"
              >
                <Wand2 className="w-5 h-5 text-white" />
              </motion.div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                AI Prompt Generator
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">{user.username}</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 transition-all duration-200"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-1.5 text-sm bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700/50 transition-all duration-200"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
                  >
                    Sign Up
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent leading-tight"
            >
              Transform Ideas into
              <br />Perfect AI Prompts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Generate optimized prompts for ChatGPT, DALL-E, Midjourney, and more.
              Turn simple ideas into detailed, effective AI instructions.
            </motion.p>
          </motion.div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-[#151515] border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    <span>What do you want to achieve with AI?</span>
                  </h3>
                  <p className="text-sm text-gray-400">
                    Describe your goal in plain language, and we'll create the perfect prompt for you.
                  </p>
                </div>
                <Textarea
                  placeholder="Example: I want to create an image of a cat playing guitar in a jazz club..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-[120px] resize-none bg-[#0a0a0a] border-gray-800 focus:border-blue-500 text-white placeholder:text-gray-600 rounded-xl transition-all duration-200"
                />
                
                {/* Configuration Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Target AI Tool</label>
                    <Select value={targetTool} onValueChange={setTargetTool}>
                      <SelectTrigger className="bg-[#0a0a0a] border-gray-800 text-white hover:border-gray-700 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#151515] border-gray-800">
                        <SelectItem value="chatgpt" className="text-white hover:bg-gray-800">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>ChatGPT</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dalle" className="text-white hover:bg-gray-800">
                          <div className="flex items-center space-x-2">
                            <Image className="w-4 h-4" />
                            <span>DALL-E</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="midjourney" className="text-white hover:bg-gray-800">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Midjourney</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Prompt Style</label>
                    <Select value={promptStyle} onValueChange={setPromptStyle}>
                      <SelectTrigger className="bg-[#0a0a0a] border-gray-800 text-white hover:border-gray-700 transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#151515] border-gray-800">
                        <SelectItem value="creative" className="text-white hover:bg-gray-800">Creative</SelectItem>
                        <SelectItem value="factual" className="text-white hover:bg-gray-800">Factual</SelectItem>
                        <SelectItem value="detailed" className="text-white hover:bg-gray-800">Detailed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <motion.button
                  onClick={handleGenerate}
                  disabled={!userInput.trim() || isGenerating}
                  whileHover={!userInput.trim() || isGenerating ? {} : { scale: 1.01 }}
                  whileTap={!userInput.trim() || isGenerating ? {} : { scale: 0.99 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Wand2 className="w-5 h-5" />
                      </motion.div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Prompt</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Output Section */}
          <AnimatePresence>
            {generatedPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="bg-[#151515] border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                          {getToolIcon(targetTool)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                            <span>Generated Prompt</span>
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Optimized for {targetTool.toUpperCase()} • {promptStyle} style
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {targetTool.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="relative">
                      <Textarea
                        value={isEditing ? editedPrompt : generatedPrompt}
                        onChange={(e) => isEditing && setEditedPrompt(e.target.value)}
                        readOnly={!isEditing}
                        className={`min-h-[160px] resize-none bg-[#0a0a0a] border-gray-800 text-white rounded-xl transition-all duration-200 ${
                          isEditing ? 'border-blue-500' : ''
                        }`}
                      />
                      {isEditing && (
                        <div className="absolute top-2 right-2 flex items-center space-x-1">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded"
                          >
                            Editing
                          </motion.span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <motion.button
                        onClick={handleCopy}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        <span className={copied ? 'text-green-400' : ''}>{copied ? 'Copied!' : 'Copy'}</span>
                      </motion.button>

                      {!isEditing ? (
                        <motion.button
                          onClick={handleEdit}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </motion.button>
                      ) : (
                        <>
                          <motion.button
                            onClick={handleSaveEdit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200"
                          >
                            <Check className="w-4 h-4" />
                            <span>Apply Changes</span>
                          </motion.button>
                          <motion.button
                            onClick={handleCancelEdit}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200"
                          >
                            <span>Cancel</span>
                          </motion.button>
                        </>
                      )}

                      <motion.button
                        onClick={handleSavePrompt}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-[#0a0a0a] hover:bg-gray-900 border border-gray-800 rounded-lg transition-all duration-200"
                      >
                        {saveSuccess ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />}
                        <span className={saveSuccess ? 'text-green-400' : ''}>{saveSuccess ? 'Saved!' : 'Save'}</span>
                      </motion.button>
                    </div>

                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center space-x-2 text-sm text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20"
                      >
                        <Check className="w-4 h-4" />
                        <span>Prompt saved to your collection</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center p-6 bg-[#151515] border border-gray-800/50 rounded-2xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Multiple AI Tools</h3>
              <p className="text-sm text-gray-400">
                Generate prompts optimized for ChatGPT, DALL-E, Midjourney, and more
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center p-6 bg-[#151515] border border-gray-800/50 rounded-2xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Smart Optimization</h3>
              <p className="text-sm text-gray-400">
                AI-powered prompt enhancement for better results
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center p-6 bg-[#151515] border border-gray-800/50 rounded-2xl"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Save className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2 text-white">Save & Organize</h3>
              <p className="text-sm text-gray-400">
                Keep your best prompts organized and easily accessible
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a0a] mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 AI Prompt Generator. Crafted with precision.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

export default App
