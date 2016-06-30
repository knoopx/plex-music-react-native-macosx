#import "AudioPlayer.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface AudioPlayer()
@property(nonatomic, strong) AVAudioPlayer* audioPlayer;
@end

@implementation AudioPlayer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(play:(NSString *)soundURL)
{
  NSData *audioData = [NSData dataWithContentsOfURL:[NSURL URLWithString:soundURL]];
  _audioPlayer = [[AVAudioPlayer alloc] initWithData:audioData error:nil];
  _audioPlayer.delegate = self;
  [_audioPlayer prepareToPlay];
  _audioPlayer.volume=1.0;
  [_audioPlayer play];
}

- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)recorder successfully:(BOOL)flag {
  [_bridge.eventDispatcher sendDeviceEventWithName:@"AudioPlayerDidFinishPlaying" body:@{@"finished": flag ? @"true" : @"false"}];
}


RCT_EXPORT_METHOD(pause)
{
    [_audioPlayer pause];
}

RCT_EXPORT_METHOD(resume)
{
    [_audioPlayer play];
}

RCT_EXPORT_METHOD(stop)
{
    [_audioPlayer stop];
}

RCT_EXPORT_METHOD(setCurrentTime:(nonnull NSNumber*)value) {
  _audioPlayer.currentTime = [value doubleValue];
}

RCT_EXPORT_METHOD(getCurrentTime:(RCTResponseSenderBlock)callback)
{
    NSTimeInterval currentTime = _audioPlayer.currentTime;
    callback(@[[NSNull null], [NSNumber numberWithDouble:currentTime]]);
}

RCT_EXPORT_METHOD(getDuration:(RCTResponseSenderBlock)callback)
{
  NSTimeInterval duration = _audioPlayer.duration;
  callback(@[[NSNull null], [NSNumber numberWithDouble:duration]]);
}


@end
