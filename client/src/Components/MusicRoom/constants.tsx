export const ICE_CONFIGURATION = {
  "iceServers": [
    {
      "urls": "stun:eu-turn4.xirsys.com"
    },
    {
      urls: [
        "turn:eu-turn4.xirsys.com:80?transport=udp",
        "turn:eu-turn4.xirsys.com:3478?transport=tcp"
      ],
      credential: '4dd454a6-feee-11e9-b185-6adcafebbb45',
      username: 'ml0jh0qMKZKd9P_9C0UIBY2G0nSQMCFBUXGlk6IXDJf8G2uiCymg9WwbEJTMwVeiAAAAAF2__hNSaW5vbGVl'
    }
  ]
};

export const USER_MEDIA_CONSTRAINTS = {
  audio: {
    echoCancellation: false,
    noiseSuppression: false
  },
  video: {
      width: {
          max: 1280
      },
      height: {
          max: 720
      }
  }
}

export const SOCKET_URL = 'https://www.singysongy.com';

export const REVERB_PRESET_LIST = [
  '1ow40',        
  'DrumPlate',        
  'JazzHall',          
  'MediumHallStage',    
  'SlapPlate',         
  'SuddenStop', 
  '2ow50',        
  'EchoPlate',        
  'LargeAmbience',     
  'Metallica',         
  'Small&Bright',    
  'Surfin', 
  'APlate',       
  'FatPlate',         
  'LargeChurch',        
  'MusicClub',           
  'SmallAmbience',      
  'ThinPlate',  
  'AutoPark',     
  'GatedAmbience',    
  'LargeHall',          
  'RPLargePlate',        
  'SmallChurch',        
  'TremeloLtoR',  
  'BackSlap',     
  'GetItWet',         
  'LargePlate',         
  'Rebound',             
  'SmallHall',          
  'Varoom',  
  'BigBottom',    
  'GuitarPlate',      
  'LargeRoom',          
  'Ricochet',            
  'SmallPlate',         
  'VeryLargeAmbience',  
  'BrickWall',    
  'HornPlate',        
  'LargeStage',         
  'ShortPlate',          
  'SmallStage',         
  'VocalPlate',  
  'BuckRam',      
  'InThePast',        
  'MediumAmbience',     
  'SillicaBeads',        
  'SnarePlate',         
  'VoxPlate2',  
  'Doubler',      
  'InsideOut',        
  'MediumHall',         
  'SilverPlate',         
  'StrongAmbience',     
  'VoxWhispers',  
];
