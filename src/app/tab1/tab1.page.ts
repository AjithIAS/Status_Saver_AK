
import { Component, OnInit } from '@angular/core';
// import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import {
  MediaCapture,
  MediaFile,
  CaptureError
} from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';

const MEDIA_FOLDER_NAME = '.Statuses';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  files = [];
  allMedia:any[] = []
  allPhotos:any[] = []
  photos:any[] = []
  videos:any[] = []
  vidsWithThumbs:any[] = []
  allVideos:any[] = []
  selectedMedia:any[] = []
 rootDir :any;
  constructor(
    // private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    private actionSheetController: ActionSheetController,
    private plt: Platform,
    private androidPermissions: AndroidPermissions,
    private videoEditor: VideoEditor,
  ) {
    this.rootDir = this.file.externalRootDirectory;
  }
 
  ngOnInit() {
    this.plt.ready().then(() => {             
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );

      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      );
      
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE, 
        this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
      ]);
      this.loadFiles();
    
      // this.loadFiles()
      let path = this.rootDir+'Android/media/com.whatsapp/Whatsapp/Media/';
      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(
        () => {
          this.loadFiles();
        },
        err => {
          console.log(err)
        }
      );
    });
  }
 
  loadFiles() { 
    let FilesData = [];
    this.file.listDir(this.rootDir+'Android/media/com.whatsapp/Whatsapp/Media/', '.Statuses').then(
      res => {
        console.log(res)
        this.files = res;
        // Loop Files
        for(let i=0;i<res.length;i++){
          // Check Image Or Videos
          let extension = res[i].name.split('.').pop()
          // console.log(res[i])
          // Video
          if(res[i].name != '.nomedia'){
            if (extension == 'mp4') {
              this.videoEditor.createThumbnail({
                fileUri: this.rootDir+'WhatsApp/Media/.Statuses/'+res[i].name,
                outputFileName:res[i].name.split('.').shift()
              })
              .then((thumbUrl) => {
                
                //get dataUrl
                let tempPath = thumbUrl.split('/')
                let thumbName = tempPath.pop()
                let pathToThumb = 'file://'+tempPath.join('/')+'/'
               
               
                this.file.readAsDataURL(pathToThumb, thumbName)
                  .then((vidThumb) => {     
                    console.log(vidThumb)    
                  })
                  .catch((err) => {console.log(err)})
                
              })
            }
            // Image
            else {
              
              
            }
            FilesData.push(res[i])
          }
          
          
        }
        console.log(FilesData)
        },err =>{
          console.log(err)
        });

  }




}
