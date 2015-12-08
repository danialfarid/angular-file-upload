using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using AspNetWebApi.Extensions;
using AspNetWebApi.Models;

namespace AspNetWebApi.Controllers
{
    public class FilesController : ApiController
    {
    private readonly string workingFolder = HttpRuntime.AppDomainAppPath + @"\Uploads";

    /// <summary>
    /// Get all photos
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<PhotoViewModel>> Get()
    {
      List<PhotoViewModel> photos = new List<PhotoViewModel>();

      DirectoryInfo photoFolder = new DirectoryInfo(workingFolder);

      await Task.Factory.StartNew(() =>
      {
        photos = photoFolder.EnumerateFiles()
                                    .Where(fi => new[] { ".jpg", ".bmp", ".png", ".gif", ".tiff" }.Contains(fi.Extension.ToLower()))
                                    .Select(fi => new PhotoViewModel
                                    {
                                      Name = fi.Name,
                                      Created = fi.CreationTime,
                                      Modified = fi.LastWriteTime,
                                      Size = fi.Length / 1024
                                    })
                                    .ToList();
      });

      return photos;
    }
    /// <summary>
    /// Delete photo
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    [HttpDelete]
    public async Task<PhotoActionResult> Delete(string fileName)
    {
      try
      {
        var filePath = Directory.GetFiles(workingFolder, fileName)
                        .FirstOrDefault();

        await Task.Factory.StartNew(() =>
        { if (filePath != null) File.Delete(filePath); });

        return new PhotoActionResult { Successful = true, Message = fileName + "deleted successfully" };
      }
      catch (Exception ex)
      {
        return new PhotoActionResult { Successful = false, Message = "error deleting fileName " + ex.GetBaseException().Message };
      }
    }
    /// <summary>
    /// Add a photo
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<PhotoViewModel>> Add()
    {
      var provider = new CustomMultipartFormDataStreamProvider(workingFolder);

      try
      {
        await Request.Content.ReadAsMultipartAsync(provider);
      }
      catch (Exception ex)
      {
        throw;
      }
   

      return provider.FileData.Select(file => new FileInfo(file.LocalFileName)).Select(fileInfo => new PhotoViewModel
      {
        Name = fileInfo.Name,
        Created = fileInfo.CreationTime,
        Modified = fileInfo.LastWriteTime,
        Size = fileInfo.Length / 1024
      }).ToList();
    }

    /// <summary>
    /// Check if file exists on disk
    /// </summary>
    /// <param name="fileName"></param>
    /// <returns></returns>
    public bool FileExists(string fileName)
    {
      var file = Directory.GetFiles(workingFolder, fileName)
                          .FirstOrDefault();

      return file != null;
    }
  }
}
