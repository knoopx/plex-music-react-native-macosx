//
//  RNVectorIconsManager.m
//  RNVectorIconsManager
//
//  Created by Joel Arvidsson on 2015-05-29.
//  Copyright (c) 2015 Joel Arvidsson. All rights reserved.
//

#import "RNVectorIconsManager.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTUtils.h"

@implementation RNVectorIconsManager

@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (NSString *)hexStringFromColor:(NSColor *)color {
  const CGFloat *components = CGColorGetComponents(color.CGColor);

  CGFloat r = components[0];
  CGFloat g = components[1];
  CGFloat b = components[2];

  return [NSString stringWithFormat:@"#%02lX%02lX%02lX",
          lroundf(r * 255),
          lroundf(g * 255),
          lroundf(b * 255)];
}


RCT_EXPORT_METHOD(getImageForFont:(NSString*)fontName withGlyph:(NSString*)glyph withFontSize:(CGFloat)fontSize withColor:(NSColor *)color callback:(RCTResponseSenderBlock)callback){
  CGFloat screenScale = RCTScreenScale();

  NSString *hexColor = [self hexStringFromColor:color];

  NSString *fileName = [NSString stringWithFormat:@"RNVectorIcons_%@_%hu_%.f%@@%.fx.png", fontName, [glyph characterAtIndex:0], fontSize, hexColor, screenScale];
  NSString *filePath = [NSTemporaryDirectory() stringByAppendingPathComponent:fileName];

  if(![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
    // No cached icon exists, we need to create it and persist to disk

    NSFont *font = [NSFont fontWithName:fontName size:fontSize];
    NSAttributedString *attributedString = [[NSAttributedString alloc] initWithString:glyph attributes:@{NSFontAttributeName: font, NSForegroundColorAttributeName: color}];
    CGSize iconSize = [attributedString size];
    [attributedString drawAtPoint:CGPointMake(0, 0)];
    
    NSImage *iconImage = [NSImage imageWithSize:iconSize flipped:YES drawingHandler:^BOOL(NSRect dstRect) {
      [glyph drawAtPoint:NSMakePoint(0, 0) withAttributes:@{NSFontAttributeName: font}];
      return YES;
    }];
    
    NSBitmapImageRep *rep = [[NSBitmapImageRep alloc] initWithCGImage:[iconImage CGImageForProposedRect:NULL context:nil hints:nil]];
    NSData *imageData = [rep representationUsingType:NSPNGFileType properties:@{}];
   
    
    BOOL success = [imageData writeToFile:filePath atomically:YES];
    if(!success) {
      return callback(@[@"Failed to write rendered icon image"]);
    }
  }
  callback(@[[NSNull null], filePath]);

}
@end
