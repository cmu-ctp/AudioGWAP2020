# iOS Build Instructions

1. Switch Build Platform to iOS.
2. Go to Build Settings -> Run in Xcode as -> Release, and check Symlink Unity Libraries.
3. Build the Project. Open Unity-iPhone.xcodeproj.
4. Open Project Settings, then in Frameworks, Libraries and Embedded Content, add WebKit.framework.
5. In Build Settings -> Architectures -> Architectures, add arm64e.
6. You are all set. Just build (also with certificates configured) and you will get the ipa file.
