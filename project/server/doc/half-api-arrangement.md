# Api Structure Before Halves

## Concepts

- Event: One whole turn for a game.
    - Task: The audio category list distributed to viewers.
- User: Stream's account./Viewer's account.
- Game Theme: Game room decoration presets.
    - Game Objects: Game stikcers. Related with Game Theme.
- Sound Categories: Predefined sound category lists; divided by broader scenarios (Kitchen, Bathroom, etc.)
    - Sound Scenario: Wider concept for categories.
    - Sound Label: Detailed sound description for one category. Defined by system. Users might be able to add new labels.
- Sound Clip: Recorded sound data with a label and an event.
- Sound Gallery: User's page to manage all the sound clips.



## Activity Diagram

### Streamer Create Event

1. Set sound categories & labels
2. Set game themes
3. Set event info
4. Click Submit

### Streamer View Event

1. View event list of current and past events
2. Click buttons ()

### Streamer View Stat

??

### Viewer Join Event

1. Click __JoinEvent__ from Home menu.
2. Input keyword/code and click on __Search__,
3. Find streamer's event and click on __Join__.

### Viewer Record & Upload Sound from an Event

1. Viewer find an event from joined events (My Events?).
2. Get event info and task list.
3. Click on one unfinished task (sound sub-category).
4. Start Recording.
5. Finish recording and set sound info.
    - Event (should be the same as joined event in previous steps)
    - Sound label (a complete list of labels that belongs to the sub-category they chose)
    - Customize / Other label (Choose Other in Sound Label and input keywords in the textbox)
6. Click on Save and upload & submit sound.

### Viewer List Sound Category

1. Click __Sound Gallery__ from Home menu.
2. Get all the recorded sound for any events.
3. Click on sound to view infomoration and play.
