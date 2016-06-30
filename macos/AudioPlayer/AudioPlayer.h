#import "RCTBridgeModule.h"
#import "RCTLog.h"
#import <AVFoundation/AVFoundation.h>

@interface AudioPlayer : NSObject <RCTBridgeModule, AVAudioPlayerDelegate>

@end
