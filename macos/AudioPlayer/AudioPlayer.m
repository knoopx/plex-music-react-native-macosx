#import "AudioPlayer.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface AudioPlayer()
@property(nonatomic, strong) AVPlayer* audioPlayer;
@property(nonatomic, strong) AVPlayer* player;
@property(nonatomic, strong) AVPlayerItem *playerItem;
@end

@implementation AudioPlayer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(play:(NSString *)url)
{
  if (_playerItem) {
    [_playerItem removeObserver:self forKeyPath:@"status"];
    [_playerItem removeObserver:self forKeyPath:@"playbackLikelyToKeepUp"];

    [[NSNotificationCenter defaultCenter] removeObserver:self
                                                 name:AVPlayerItemDidPlayToEndTimeNotification
                                               object:_playerItem];

  }
  _player = [[AVPlayer alloc]initWithURL:[NSURL URLWithString:url]];
  _playerItem = [_player currentItem];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(playerItemDidReachEnd:)
                                               name:AVPlayerItemDidPlayToEndTimeNotification
                                             object:[_player currentItem]];

  [_playerItem addObserver:self forKeyPath:@"status" options:0 context:nil];
  [_playerItem addObserver:self forKeyPath:@"playbackLikelyToKeepUp" options:0 context:nil];
  [_player play];
}

- (void)playerItemDidReachEnd:(NSNotification *)notification
{
  [_bridge.eventDispatcher sendDeviceEventWithName:@"onPlaybackEnd" body:@{}];
}


RCT_EXPORT_METHOD(pause)
{
    [_player pause];
}

RCT_EXPORT_METHOD(resume)
{
    [_player play];
}

RCT_EXPORT_METHOD(setCurrentTime:(nonnull NSNumber*)value) {
  CMTime time = CMTimeMakeWithSeconds([value doubleValue], _player.rate);
  [_player seekToTime: time];
}

RCT_EXPORT_METHOD(getProgress:(RCTResponseSenderBlock)callback)
{
  AVPlayerItem *item = [_player currentItem];
  callback(@[[NSNull null], @{@"currentTime": [NSNumber numberWithFloat:CMTimeGetSeconds(item.currentTime)],
                              @"playableDuration": [self calculatePlayableDuration]}]);
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
  if (object == _playerItem) {

    if ([keyPath isEqualToString:@"status"]) {
      if (_playerItem.status == AVPlayerItemStatusReadyToPlay) {
        float duration = CMTimeGetSeconds(_playerItem.asset.duration);
        if (isnan(duration)) {
          duration = 0.0;
        }

        [_bridge.eventDispatcher sendDeviceEventWithName:@"onPlaybackLoad"
                                             body:@{@"duration": [NSNumber numberWithFloat:duration],
                                                    @"currentTime": [NSNumber numberWithFloat:CMTimeGetSeconds(_playerItem.currentTime)],
                                                    @"canPlayReverse": [NSNumber numberWithBool:_playerItem.canPlayReverse],
                                                    @"canPlayFastForward": [NSNumber numberWithBool:_playerItem.canPlayFastForward],
                                                    @"canPlaySlowForward": [NSNumber numberWithBool:_playerItem.canPlaySlowForward],
                                                    @"canPlaySlowReverse": [NSNumber numberWithBool:_playerItem.canPlaySlowReverse],
                                                    @"canStepBackward": [NSNumber numberWithBool:_playerItem.canStepBackward],
                                                    @"canStepForward": [NSNumber numberWithBool:_playerItem.canStepForward]}];

      } else if(_playerItem.status == AVPlayerItemStatusFailed) {
        [_bridge.eventDispatcher sendDeviceEventWithName:@"onPlaybackError"
                                             body:@{@"error": @{
                                                        @"code": [NSNumber numberWithInteger: _playerItem.error.code],
                                                        @"domain": _playerItem.error.domain}}];
      }
    } else if ([keyPath isEqualToString:@"playbackLikelyToKeepUp"]) {
      // buffering
    }
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}


- (void)sendProgressUpdate
{
  AVPlayerItem *video = [_player currentItem];
  if (video == nil || video.status != AVPlayerItemStatusReadyToPlay) {
    return;
  }

    [_bridge.eventDispatcher sendDeviceEventWithName:@"onPlaybackProgress"
                                         body:@{@"currentTime": [NSNumber numberWithFloat:CMTimeGetSeconds(video.currentTime)],
                                                @"playableDuration": [self calculatePlayableDuration]}];
}

- (NSNumber *)calculatePlayableDuration
{
  AVPlayerItem *video = _player.currentItem;
  if (video.status == AVPlayerItemStatusReadyToPlay) {
    __block CMTimeRange effectiveTimeRange;
    [video.loadedTimeRanges enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
      CMTimeRange timeRange = [obj CMTimeRangeValue];
      if (CMTimeRangeContainsTime(timeRange, video.currentTime)) {
        effectiveTimeRange = timeRange;
        *stop = YES;
      }
    }];
    Float64 playableDuration = CMTimeGetSeconds(CMTimeRangeGetEnd(effectiveTimeRange));
    if (playableDuration > 0) {
      return [NSNumber numberWithFloat:playableDuration];
    }
  }
  return [NSNumber numberWithInteger:0];
}


@end
