# -*- coding: utf-8 -*-
"""
Created on Fri Jul 16 16:38:31 2021

@author: gokdumano
"""
import urllib.request
import json, random
import pygame

def RandomWord(n_letter:int=random.randint(3,15)) -> str:
    MIN, MAX    = 3, 15
    n_letter    = min(MAX, max(MIN, n_letter))                                  # ensuring n_letter within the limits
    url         = "https://www.randomlists.com/data/words.json"
    response    = urllib.request.urlopen(url)
    data        = json.loads(response.read())
    words       = data["data"]
    
    while len(word:=random.choice(words)) != n_letter:                          # choosing until the criteria is met
        pass
    
    return word.replace("-", " ").upper()
    
class Game:
    def __init__(self, string, width, height, chalk_audio_path, success_audio_path, board_path, frame_rate, font_path, font_size=16):
        pygame.init()
        pygame.mixer.init()
        pygame.font.init()
        
        self.BACKGROUND = ( 55, 148, 110)
        self.FOREGROUND = (215, 215, 215)
        self.QUIT       = False
        self.CLOCK      = pygame.time.Clock()
        
        self.Chalk      = chalk_audio_path
        self.Success    = success_audio_path
        self.Board      = pygame.image.load(board_path)
        self.String     = string
        self.Dummy      = "".join(["_" for char in self.String])
        
        
        self.Font(font_path, font_size)
        self.Display(width, height, frame_rate)
        self.Blit(self.Board, (5, 5))
        self.Quess(" ")
                
    def Font(self, font_path, font_size):
        self.fontObj = pygame.font.Font(font_path, font_size)
        
    def Display(self, width, height, frame_rate):
        pygame.display.set_caption("(not)Hangman")
        self.FrameRate      = frame_rate
        self.GameDisplay    = pygame.display.set_mode((width,height))
        WHITE               = (255, 255, 255)
        self.GameDisplay.fill(WHITE)
        
    def Blit(self, obj, pos):
        self.GameDisplay.blit(obj, pos)
        
    def Quess(self, char):
        if char in self.String:
            if char not in self.Dummy:
                self.Dummy = "".join([char if d == "_" and s == char else d for (s, d) in zip(self.String, self.Dummy)])
                self.Text(self.Dummy)
                self.Audio(self.Chalk)
                
                if "_" not in self.Dummy:
                    print("SUCCESS!")
                    self.Audio(self.Success)
                    
        else:
            self.Text(self.Dummy)
        
    def Text(self, text):
        text = self.fontObj.render(text, True, self.FOREGROUND, self.BACKGROUND)
        rect = text.get_rect()
        rect.center = (self.GameDisplay.get_width() // 2, self.GameDisplay.get_height() // 2)
        self.Blit(text, rect)
        
    def Audio(self, audio_path):
        pygame.mixer.music.load(audio_path)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            pygame.event.poll()
            self.CLOCK.tick(self.FrameRate)
        
    def Start(self):        
        while not self.QUIT:
            for event in pygame.event.get():
                if   event.type == pygame.QUIT      : self.QUIT = True
                elif event.type == pygame.KEYDOWN   : self.Quess(event.unicode.upper())
            
            pygame.display.update()
            self.CLOCK.tick(self.FrameRate)
        pygame.quit()
        
GAME_WIDTH      = 320
GAME_HEIGHT     = 200
FRAME_RATE      = 60

WORD            = RandomWord()                                  # https://www.randomlists.com/data/words.json
AUDIO_CHALK     = "../sound/chalk_normal.mp3"                   # https://freesound.org/people/jobro/sounds/60443/
AUDIO_SUCCESS   = "../sound/tada.wav"                           # https://freesound.org/people/richymel/sounds/43548/
FONT_PATH       = "../sprite/font_daydream_3/Daydream.ttf"      # https://www.dafont.com/daydream-3.font
BOARD_PATH      = "../sprite/board.png"

game = Game(WORD, GAME_WIDTH, GAME_HEIGHT, AUDIO_CHALK, AUDIO_SUCCESS, BOARD_PATH, FRAME_RATE, FONT_PATH)
game.Start()