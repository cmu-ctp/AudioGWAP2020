# iOS Build Instructions

Before Starting,
1. Download XCode
2. Set up XCode with your Apple ID

To Build iOS App,
1. Switch Build Platform to iOS.
2. Go to Build Settings -> Run in Xcode as -> Release, and check Symlink Unity Libraries.
3. Build the Project. Open Unity-iPhone.xcodeproj in XCode (should be in the new folder just created).
4. Open Project Settings, then in Frameworks, Libraries and Embedded Content, add WebKit.framework.
5. Under Signings & Capabilities, ensure that your XCode account is selected under Team and "Automatically manage signing" is checked.
6. In Build Settings -> Architectures -> Architectures, add arm64e.
7. Connect your device to your laptop.
8. You are all set. Just build (also with certificates configured) and you will get the ipa file.
9. Once the app is downloaded onto your phone, you may need to adjust some settings. Go to General > Device Management and allow your phone to trust the app. 
10. You should be able to open the app and run! 
